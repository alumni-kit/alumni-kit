const fs = window.require('fs');

const writeToFile = function(filePath) {
    const reactAppContext = this;
    const { columns, totalRows } = reactAppContext.state;
    const project = JSON.stringify({ columns, totalRows });
  
    fs.writeFile(filePath, project, (err) => {
        if (err) throw err;
    })
};

export default writeToFile;