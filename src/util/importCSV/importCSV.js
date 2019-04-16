import setHeaders from './setHeaders';
import setRows from './setRows';
import { reject } from 'q';
const csvtojson = window.require('csvtojson');

const importCSV = ({csvString, filePath, App}) => {
    let csvProcess;
    if (csvString) {
        csvProcess = csvtojson().fromString(csvString);
    } else if (filePath) {
        csvProcess = csvtojson().fromFile(filePath);
    }

    const missingFields = [];
    
    csvProcess
        .on('header', (headers) => {
            const requiredFields = [
                "First Name",
                "Last Name",
                "Email1",
                "Email2",
                "Phone1",
                "Phone2",
                "Mailing Address"
            ];


            // If one of the required fields is missing, break out of importing
            requiredFields.forEach(requiredField => {
                if (!headers.includes(requiredField)) {
                    missingFields.push(requiredField);
                }
            });

            if (missingFields.length > 0) {
                App.showToast("error", `The following required fields are missing: ${missingFields.join(", ")}`);
                return;
            }
            
            setHeaders.bind(App, headers)();
        })
        .then((rows) => {
            if (missingFields.length > 0) {
                return;
            } else {
                setRows.bind(App, '', filePath, rows)();
            }
        });
};

export default importCSV;