const {
    app,
    Menu,
    Tray,
} = require('electron');

class TrayIcon extends Tray {
    constructor(iconPath){
        super(iconPath);

        this.setToolTip('Screenshot Taker');

        this.on('click', this.onClick.bind(this));
        //this.on('right-click', this.onRightClick.bind(this)); 
        // right-click only works on win and mac :(
        this.buildContextMenu();
    }   
    
    onClick(event, bounds){
        //console.log('onClick');
        const { x, y } = bounds;
    }

    buildContextMenu(){
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click() { app.quit(); }
            }
        ]);

        this.setContextMenu(menuConfig);
    }
}

module.exports = TrayIcon;