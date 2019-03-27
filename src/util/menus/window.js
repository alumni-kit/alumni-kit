const generateWindowMenu = () => {
    return {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    }
}

export default generateWindowMenu;