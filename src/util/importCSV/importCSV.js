import setHeaders from './setHeaders';
import setRows from './setRows';
const csvtojson = window.require('csvtojson');

const importCSV = ({csvString, filePath, App}) => {
    let csvProcess;
    if (csvString) {
        csvProcess = csvtojson().fromString(csvString);
    } else if (filePath) {
        csvProcess = csvtojson().fromFile(filePath);
    }

    csvProcess
        .on('header', setHeaders.bind(App))
        .then(setRows.bind(App, '', filePath));
};

export default importCSV;