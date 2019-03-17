import React, { Component } from 'react';
import ReactDataGrid from "react-data-grid";
import qs from "qs";
import './App.css';
import ApiKeyModal from "./components/ApiKeyModal/ApiKeyModal";

const electron = window.require('electron');
const { remote } = electron;
const { dialog, Menu } = remote;

const csvtojson = window.require("csvtojson");
const jsontocsv = window.require('json2csv').Parser;
const fs = window.require('fs');

const generateMenu = (reactAppContext) => {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: "Open",
          click () {
            dialog.showOpenDialog({
              filters: [{ name: 'Comma Separated Values', extensions: ['csv'] }],
              properties: ['openFile']
            }, (filePaths) => {
              const filePath = filePaths[0];
              csvtojson()
                .fromFile(filePath)
                .on('header', (headers) => {
                  const columns = headers.map((header) => {
                    return {
                      editable: false,
                      key: header,
                      name: header,
                      width: 240,
                    };
                  });
                  reactAppContext.setState({ columns });
                })
                .then((rowsFromCSV)=>{
                  const rows = rowsFromCSV.map((row, index) => {
                    row.id = index;
                    return row;
                  })

                  reactAppContext.setState({ filePath, rows });
                });
            });
          }
        },
        {
          label: "Save",
          click () {
            if (!reactAppContext.state.filePath) {
              return;
            }
            const fields = reactAppContext.state.columns.map(column => column.name);
            const filePath = reactAppContext.state.filePath;
            const rows = reactAppContext.state.rows;

            const parser = new jsontocsv({ fields });
            const csv = parser.parse(rows);
            fs.writeFile(filePath, csv, (err) => {
              if (err) throw err;
              console.log('The file has been saved!');
            });
          }
        },
        {
          label: "Save As",
          click () {
            dialog.showSaveDialog({
              filters: [{ name: 'Comma Separated Values', extensions: ['csv'] }],
            }, (filePath) => {
              const fields = reactAppContext.state.columns.map(column => column.name);
              const rows = reactAppContext.state.rows;
              const parser = new jsontocsv({ fields });
              const csv = parser.parse(rows);
              fs.writeFile(filePath, csv, (err) => {
                if (err) throw err;
              })
            });
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { electron.shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

const columns = [
  { key: "0", name: "", editable: false },
  { key: "1", name: "", editable: false },
  { key: "2", name: "", editable: false },
  { key: "3", name: "", editable: false },
  { key: "4", name: "", editable: false }
];

const rows = [];
for(let i = 0; i < 50; i++) {
  rows.push({ id: i });
};

class App extends Component {
  state = {
    columns,
    filePath: '',
    openApiKeyModal: false,
    rows,
    selectedIndexes: []
  }
  
  componentDidMount() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);

    const PIPL_API_KEY = window.process.env.PIPL_API_KEY;

    if (PIPL_API_KEY === "" || typeof PIPL_API_KEY === undefined) {
      this.openApiKeyModal(PIPL_API_KEY);
    }

    generateMenu(this);
  }

  closeApiKeyModal = () => {
    this.setState({ openApiKeyModal: false });
  }

  openApiKeyModal = (piplApiKey) => {
    this.setState({ openApiKeyModal: true, piplApiKey });
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  onRowsSelected = rows => {
    this.setState({
      selectedIndexes: this.state.selectedIndexes.concat(
        rows.map(r => r.rowIdx)
      )
    });
  };

  onRowsDeselected = rows => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.setState({
      selectedIndexes: this.state.selectedIndexes.filter(
        i => rowIndexes.indexOf(i) === -1
      )
    });
  };

  startPiplSearch = e => {
    const { rows } = this.state;
    const propertyDictionary = {
      "First Name": "names",
      "Last Name": "names",
      "Email1": "emails",
      "Email2": "emails",
      "Phone1": "phones",
      "Phone2": "phones",
      "Mailing Address": "addresses"
    }

    rows.forEach(row => {
      const person = {
        names: [],
        emails: [],
        phones: []
      }

      const nameObject = {};

      if (row["First Name"]) {
        nameObject.first = row["First Name"];
      }

      if (row["Last Name"]) {
        nameObject.last = row["Last Name"];
      }

      person.names.push(nameObject);

      for (let key in row) {
        if (key !== "First Name" && key !== "Last Name" && key !== "Mailing Address" && key !== "id") {
          if (row[key]) {
            const arrayProperty = propertyDictionary[key];
            person[arrayProperty].push(row[key]);
          }
        }
      }

      if (row["Mailing Address"]) {
        person.addresses = [];
        person.addresses.push({ raw: row["Mailing Address"] });
      }

      const requestObject = { person: JSON.stringify(person), key: window.process.env.PIPL_API_KEY };
      const queryString = qs.stringify(requestObject);
      const queryObject = qs.parse(queryString);
      console.log(queryString);
      console.log(queryObject);
    });
  }

  savePiplApiKey = () => {
    const { piplApiKey } = this.state;

    fs.writeFile('.env', `PIPL_API_KEY=${piplApiKey}`, (err) => {
      if (err) {
        throw err;
      }
      window.process.env.PIPL_API_KEY = piplApiKey;
      this.closeApiKeyModal();
    });
  }

  updatePiplApiKey = e => {
    const piplApiKey = e.target.value;

    this.setState({ piplApiKey });
  }

  render() {
    const { filePath, openApiKeyModal, piplApiKey, rows } = this.state;
    return (
      <div>
        <ApiKeyModal
          closeApiKeyModal={this.closeApiKeyModal}
          openApiKeyModal={openApiKeyModal}
          piplApiKey={piplApiKey}
          savePiplApiKey={this.savePiplApiKey}
          updatePiplApiKey={this.updatePiplApiKey}
        />
        <div style={{ display: "flex", justifyContent: "space-between", padding: "15px" }}>
          <div>{filePath}</div>
          <div><button onClick={this.startPiplSearch}>Start Pipl Search</button></div>
        </div>
        <ReactDataGrid
          columns={this.state.columns}
          minHeight={window.visualViewport.height}
          rowGetter={i => rows[i]}
          rowsCount={rows.length}
          // rowSelection={{
          //   enableShiftSelect: false,
          //   onRowsSelected: this.onRowsSelected,
          //   onRowsDeselected: this.onRowsDeselected,
          //   selectBy: {
          //     indexes: this.state.selectedIndexes
          //   }
          // }}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
        />
      </div>
    );
  }
}

export default App;
