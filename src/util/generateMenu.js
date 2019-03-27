import generateFileMenu from "./menus/fileMenu";
import generatePreferencesMenu from "./menus/preferences";
import generateViewMenu from "./menus/view";
import generateWindowMenu from "./menus/window";
import generateHelpMenu from "./menus/help";

const electron = window.require('electron');
const { remote } = electron;
const { Menu } = remote;

const generateMenu = (reactAppContext) => {
    const template = [
      generateFileMenu(reactAppContext),
      generatePreferencesMenu(reactAppContext),
      generateViewMenu(),
      generateWindowMenu(),
      generateHelpMenu(),
    ]
    
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

export default generateMenu;