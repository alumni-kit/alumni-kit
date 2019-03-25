import StatusFormatter from './statusFormatter';

const electron = window.require('electron');
const { remote } = electron;
const { BrowserWindow, dialog, Menu } = remote;

const csvtojson = window.require("csvtojson");
const jsontocsv = window.require('json2csv').Parser;
const fs = window.require('fs');

const writeToFile = function(filePath) {
  const reactAppContext = this;
  const { columns, rows } = reactAppContext.state;
  const project = JSON.stringify({ columns, rows });

  fs.writeFile(filePath, project, (err) => {
    if (err) throw err;
  })
};

const generateMenu = (reactAppContext) => {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: "New Project",
            click () {
              const mainWindow = new BrowserWindow({
                minWidth: 400,
                minHeight: 400,
                width: 800,
                height: 600,
                webPreferences: {
                  nodeIntegration: true
                }
              });

              const startUrl = "http://localhost:5000";

              // and load the index.html of the app.
              mainWindow.loadURL(startUrl);

              // Open the DevTools.
              // mainWindow.webContents.openDevTools()

              // Emitted when the window is closed.
              mainWindow.on('closed', function () {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                mainWindow = null;
              });            }
          },
          {
            label: "Open Project",
            click () {
              dialog.showOpenDialog({
                filters: [{ name: 'JSON', extensions: ['json'] }],
                properties: ['openFile']
              }, (filePaths) => {
                const filePath = filePaths[0];

                fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
                  if (err) throw err;

                  const { columns, rows } = JSON.parse(data);

                  const formattedColumns = columns.map((column) => {
                    if (column.name === "Status") {
                      column = Object.assign(column, { formatter: StatusFormatter, width: 128 });
                    }

                    return column;
                  });

                  reactAppContext.setState({ columns: formattedColumns, rows, filePath });
                })
              });
            }
          },
          {
            label: "Save Project",
            click () {
              const { filePath } = reactAppContext.state;

              if (!filePath) {
                dialog.showSaveDialog({
                  filters: [{ name: 'JSON', extensions: ['json'] }],
                }, writeToFile.bind(reactAppContext));
              } else {
                writeToFile.apply(reactAppContext,filePath);
              }
            }
          },
          {
            label: "Save Project As",
            click () {
              dialog.showSaveDialog({
                filters: [{ name: 'JSON', extensions: ['json'] }],
              }, writeToFile.bind(reactAppContext));
            }
          },
          { type: "separator" },
          {
            label: "Import CSV",
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
                      "Status": "Status",
                      "id": "id",
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

                      if (header === "Status") {
                        column = Object.assign(column, { formatter: StatusFormatter, width: 128 });
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
            label: "Export CSV",
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
          },
          { type: "separator" },
          { role: "quit" }
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
            label: 'Documentation',
            click () { electron.shell.openExternal('https://github.com/alumni-kit/alumni-kit/wiki') }
          }
        ]
      }
    ]
    
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

export default generateMenu;