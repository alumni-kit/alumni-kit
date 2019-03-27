const electron = window.require('electron');

const generateHelpMenu = () => {
    return {
        role: 'help',
        submenu: [
            {
                label: 'Documentation',
                click () { electron.shell.openExternal('https://github.com/alumni-kit/alumni-kit/wiki') }
            }
        ]
    }
}

export default generateHelpMenu;