const electron = window.require('electron');

const generateHelpMenu = (reactAppContext) => {
    return {
        role: 'help',
        submenu: [
            {
                label: 'Documentation',
                click () { electron.shell.openExternal('https://github.com/alumni-kit/alumni-kit/wiki') }
            },
            { type: "separator" },
            {
                label: 'About',
                click () { reactAppContext.setState({ openAboutModal: true }) }
            }
        ]
    }
}

export default generateHelpMenu;