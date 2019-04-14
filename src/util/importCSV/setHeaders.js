import StatusFormatter from 'util/statusFormatter';

const setHeaders = function(headers = []) {
    const App = this;
    const requiredFields = {
        "id": "id",
        "Status": "Status",
        "Match Confidence": "Match Confidence",
        "Last Update": "Last Update",
        "First Name": "First Name",
        "Last Name": "Last Name",
        "Email1": "Email1",
        "Email2": "Email2",
        "Phone1": "Phone1",
        "Phone2": "Phone2",
        "Mailing Address": "Mailing Address",
        "Education": "Education",
        "Job": "Job"
    }
    const mergedHeaders = Object.assign(requiredFields, ...headers.map(header => ({[header]: header})));
    const mergedHeadersArray = Object.keys(mergedHeaders);

    const columns = mergedHeadersArray.map((header) => {
        let column = {
            editable: false,
            key: header,
            name: header,
        };

        // Set the width of the id column
        if (header === "id") {
            column = Object.assign(column, { width: 50 });
        }

        if (header === "Status") {
            column = Object.assign(column, { formatter: StatusFormatter, width: 128 });
        }

        return column;
    });

    App.setState({ columns });
};

export default setHeaders;