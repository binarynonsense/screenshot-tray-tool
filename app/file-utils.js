const path = require('path');
const os = require('os');
const fs = require('fs');

const {
    app
} = require('electron');

function getSavePath(){
    // ref: https://www.electronjs.org/docs/api/dialog#dialogshowopendialogsyncbrowserwindow-options
    // ref: https://www.electronjs.org/docs/api/dialog#dialogshowmessageboxsyncbrowserwindow-options
    // let outputFolder = dialog.showOpenDialogSync({
    //   title: 'Choose output folder',
    //   //defaultPath: 
    //   properties: ['openDirectory']
    // });
    // console.log(outputFolder[0]); 

    let savePath = undefined;

    var date = new Date();
    var dateElements = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];
    var dateString = dateElements.join("");
    
    savePath = path.join(os.tmpdir(), 'screenshot_' + dateString + '.jpg');

    if (fs.existsSync(app.getPath('desktop'))) {
      try {
        fs.accessSync(app.getPath('desktop'), fs.constants.W_OK);
        // ref: https://www.electronjs.org/docs/api/app#appgetpathname 
        savePath = path.join(app.getPath('desktop'), 'screenshot_' + dateString + '.jpg');
      }
      catch (err) {
        console.log("unable to save in %s", app.getPath('desktop'));
      }      
    }

    return savePath;
}

exports.getSavePath = getSavePath;