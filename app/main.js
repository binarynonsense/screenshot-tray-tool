const path = require('path');
const TrayIcon = require('./tray-icon');
const fileUtils = require('./file-utils');

const {
  app,
  BrowserWindow,
  globalShortcut,
  //dialog
  } = require('electron');

function isDev() {
  return process.argv[2] == '--dev';
}

function takeScreenshot(currentWindow) {
  const outputPath = fileUtils.getSavePath();
  console.log('take and save screenshot: ' + outputPath);
  currentWindow.webContents.send('take-screenshot', outputPath); 
}

let trayIcon = null;
let emptyWindow = null;

app.on('ready', () => {
  trayIcon = new TrayIcon(path.join(__dirname, 'assets/tray-icon.png'));

  // empty window to render screenshot
  emptyWindow = new BrowserWindow({
    show: false,
    webPreferences: {
        nodeIntegration: true
    }
  });
    
  const indexPath = 'file://' + __dirname + '/index.html';
  emptyWindow.loadURL(indexPath);

  // set global shortcuts
  let shortcut = 'CommandOrControl+Shift+3';
  // shortcut = 'F12';
  // if(process.platform === "win32") shortcut = 'CommandOrControl+Shift+3';  
  //shortcut = 'PrintScreen'; // doesn't work!?
  const ret = globalShortcut.register(shortcut, () => {
    takeScreenshot(emptyWindow);
  });

  if (!ret) {
    console.log('error adding global shortcut');
  } else {
      console.log('global shortcut added: ' + shortcut);
  }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
