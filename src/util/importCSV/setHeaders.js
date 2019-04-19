import StatusFormatter from 'util/formatters/statusFormatter';

const setHeaders = function(headers = []) {
    const App = this;
    const requiredFields = {
        "id": "id",
        "Status": "Status",
        "Number of Possible Matches": "Number of Possible Matches",
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
    const mergedHeaders = Object.assign(requiredFields, ...headers.map(header => {
        // Only render the expected fields. Any other fields are ignored.
        if (Object.keys(requiredFields).includes(header)) {
            return ({[header]: header});
        }
    }));
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