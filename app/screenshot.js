const path = require('path');
const fs = require('fs');
const os = require('os');
const { 
    ipcRenderer,
    desktopCapturer,
    shell,    
    remote
 } = require('electron');

function isDev() {
  return remote.process.argv[2] == '--dev';
}

ipcRenderer.on('show-notification', (event, title, body) => {
  sendBasicNotification = (title, body);
});

ipcRenderer.on('take-screenshot', (event, outputPath) => {
  takeScreenshot(outputPath);
});

const sendBasicNotification = (title, body) => {
  const myNotification = new Notification(title, { body });
};

const sendScreenshotNotification = (filePath) => {
  const myNotification = new Notification('Screenshot taken', { body: filePath });
  myNotification.onclick = () => {
    shell.openExternal(`file://${filePath}`);
  }
};

const takeScreenshot = async (outputPath) => {
  const screen = remote.screen;
  const currentWindow = remote.getCurrentWindow();
  const currentWindowBounds = currentWindow.getBounds();  

  try {
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
      }
    });

    const screenSource = sources.find(
      source => source.name === 'Entire Screen' || source.name === 'Screen 1'
    );

    if (screenSource) {
      
      const screenshot = screenSource.thumbnail
        .resize({
          width: screenSize.width,
          height: screenSize.height
        }).toJPEG(90);

      fs.writeFile(outputPath, screenshot, err => {
        if (err) {
          sendBasicNotification('Error taking screenshot', err);
          return console.error(err);
        }
        sendScreenshotNotification(outputPath);
      });
    } else {
      sendBasicNotification('Error taking screenshot', 'Screen source not found');
    }
  } catch (err) {
    console.error(err);
    sendBasicNotification('Error taking screenshot', err);
  }
};