const fs = window.require('fs');

const writeToFile = function(filePath) {
    const reactAppContext = this;
    const { columns, rows } = reactAppContext.state;
    const project = JSON.stringify({ columns, rows });
  
    fs.writeFile(filePath, project, (err) => {
        if (err) throw err;
    })
};

export default writeToFile;