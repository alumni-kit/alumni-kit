const setRows = function(filePath, rowsFromCSV = []) {
    const App = this;

    const rows = rowsFromCSV.map((row, index) => {
        row.id = index;
        return row;
    });

    App.setState({ filePath, rows });
}

export default setRows;