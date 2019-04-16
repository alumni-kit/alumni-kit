const setRows = function(filePath = '', fileName = '', rowsFromCSV = []) {
    const App = this;

    const rows = rowsFromCSV.map((row, index) => {
        row.id = index;
        return row;
    });

    App.setState({ fileName, filePath, rows, totalRows: JSON.parse(JSON.stringify(rows)) });
}

export default setRows;