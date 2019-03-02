import React, { Component } from 'react';
import ReactDataGrid from "react-data-grid";
import './App.css';

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
  state = { columns, filePath: '', rows, selectedIndexes: [] }
  
  componentDidMount() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);

    generateMenu(this);
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

  render() {
    return (
      <ReactDataGrid
        columns={this.state.columns}
        minHeight={window.visualViewport.height}
        rowGetter={i => this.state.rows[i]}
        rowsCount={this.state.rows.length}
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
    );
  }
}

export default App;
