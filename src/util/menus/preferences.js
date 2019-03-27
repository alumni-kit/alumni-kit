const generatePreferencesMenu = (reactAppContext) => {
    return {
        label: 'Preferences',
        submenu: [
            {
                label: "Enter API Key",
                click () {
                    reactAppContext.openApiKeyModal(reactAppContext.state.piplApiKey);
                }
            }
        ]
    }
}

export default generatePreferencesMenu;