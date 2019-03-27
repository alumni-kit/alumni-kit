const electron = window.require('electron');
const { remote } = electron;
const { BrowserWindow } = remote;

const generateNewWindow = (startUrl = "http://localhost:5000") => {
  let mainWindow = new BrowserWindow({
    minWidth: 400,
    minHeight: 400,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
    
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
  });
}

export default generateNewWindow;