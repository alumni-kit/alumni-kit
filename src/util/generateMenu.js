import generateFileMenu from "./menus/fileMenu";
import generatePreferencesMenu from "./menus/preferences";
import generateViewMenu from "./menus/view";
import generateWindowMenu from "./menus/window";
import generateHelpMenu from "./menus/help";

const electron = window.require('electron');
const contextMenu = window.require('electron-context-menu');
const { remote } = electron;
const { Menu } = remote;
 
// Adds context menu (right click for copy and paste) for inputs and plain text
contextMenu();

const generateMenu = (reactAppContext) => {
    const template = [
      generateFileMenu(reactAppContext),
      generatePreferencesMenu(reactAppContext),
      generateViewMenu(),
      generateWindowMenu(),
      generateHelpMenu(reactAppContext),
    ]
    
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

export default generateMenu;