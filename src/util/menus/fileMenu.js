import StatusFormatter from 'util/formatters/statusFormatter';
import importCSV from 'util/importCSV/importCSV';
import writeToProjectFile from 'util/writeToProjectFile';
import generateNewWindow from 'util/generateNewWindow';

const electron = window.require('electron');
const { remote } = electron;
const { dialog } = remote;

const jsontocsv = window.require('json2csv').Parser;
const fs = window.require('fs');

const generateFileMenu = (reactAppContext) => {
    return {
        label: 'File',
        submenu: [
          {
            label: "New Project",
            click: generateNewWindow,
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
    
                  const { columns, totalRows } = JSON.parse(data);
                  const rows = JSON.parse(JSON.stringify(totalRows));
    
                  const formattedColumns = columns.map((column) => {
                    if (column.name === "Status") {
                      column = Object.assign(column, { formatter: StatusFormatter, width: 128 });
                    }
    
                    return column;
                  });
    
                  reactAppContext.setState({ columns: formattedColumns, rows, totalRows, filePath });
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
                }, writeToProjectFile.bind(reactAppContext));
              } else {
                writeToProjectFile.apply(reactAppContext,filePath);
              }
            }
          },
          {
            label: "Save Project As",
            click () {
              dialog.showSaveDialog({
                filters: [{ name: 'JSON', extensions: ['json'] }],
              }, writeToProjectFile.bind(reactAppContext));
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
    
                importCSV({ filePath, App: reactAppContext});
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
    };
};

export default generateFileMenu;