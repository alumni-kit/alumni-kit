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
                    const requiredFields = {
                      "id": "id",
                      "Status": "Status",
                      "First Name": "First Name",
                      "Last Name": "Last Name",
                      "Email1": "Email1",
                      "Email2": "Email2",
                      "Phone1": "Phone1",
                      "Phone2": "Phone2",
                      "Mailing Address": "Mailing Address",
                      "Education": "Education",
                      "Job": "Job"
                    }
                    const mergedHeaders = Object.assign(requiredFields, ...headers.map(header => ({[header]: header})));
                    const mergedHeadersArray = Object.keys(mergedHeaders);

                    const columns = mergedHeadersArray.map((header) => {
                      let column = {
                        editable: false,
                        key: header,
                        name: header,
                      };

                      // Set the width of the id column
                      if (header === "id") {
                          column = Object.assign(column, { width: 50 });
                      }

                      return column;
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
        label: 'Preferences',
        submenu: [
          {
            label: "Enter API Key",
            click () {
              reactAppContext.openApiKeyModal(reactAppContext.state.piplApiKey);
            }
          }
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

export default generateMenu;