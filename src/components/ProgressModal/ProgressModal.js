import React, { Component } from "react";
import { Button, Modal, Progress } from "semantic-ui-react";
import qs from "qs";

class ProgressModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            completedSearches: 0,
            totalSearches: 1,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openProgressModal, totalSearches: props.App.state.rows.length });

        if (props.openProgressModal) {
            this.startPiplSearch();
        }
    }

    close = () => this.props.App.setState({ openProgressModal: false });

    startPiplSearch = async () => {
        const { App } = this.props;
        const { rows } = App.state;
        const propertyDictionary = {
            "First Name": "names",
            "Last Name": "names",
            "Email1": "emails",
            "Email2": "emails",
            "Phone1": "phones",
            "Phone2": "phones",
            "Mailing Address": "addresses"
        }

        const updatedRows = await rows.map(async (row, index) => {
            const person = {
                names: [],
                emails: [],
                phones: []
            }

            const nameObject = {};

            if (row["First Name"]) {
                nameObject.first = row["First Name"];
            }

            if (row["Last Name"]) {
                nameObject.last = row["Last Name"];
            }

            person.names.push(nameObject);

            for (let key in row) {
                if (key !== "First Name" && key !== "Last Name" && key !== "Mailing Address" && key !== "id") {
                    if (row[key]) {
                        const arrayProperty = propertyDictionary[key];
                        person[arrayProperty].push(row[key]);
                    }
                }
            }

            if (row["Mailing Address"]) {
                person.addresses = [];
                person.addresses.push({ raw: row["Mailing Address"] });
            }

            const requestObject = { person: JSON.stringify(person), key: window.process.env.PIPL_API_KEY };
            const queryString = qs.stringify(requestObject);
            const newRow = await this.getNewRow(queryString);

            this.setState({ completedSearches: index + 1 });

            return Object.assign(row, newRow);
        });

        Promise.all(updatedRows)
            .then(rows => {
                App.setState({ rows });
                window.dispatchEvent(new Event('resize'));
            });
    }
    
    getNewRow = async () => {
        return await fetch('/temp/person.json')
            .then(response => response.json())
            .then(async json => {
                const possiblePerson = json.possible_persons[0];
                const row = {
                    "First Name": possiblePerson.names[0].first,
                    "Last Name": possiblePerson.names[0].last,
                    "Email1": (possiblePerson.emails || [])[0] ? possiblePerson.emails[0].address : "",
                    "Email2": (possiblePerson.emails || [])[1] ? possiblePerson.emails[1].address : "",
                    "Phone1": possiblePerson.phones[0] ? possiblePerson.phones[0].display : "",
                    "Phone2": possiblePerson.phones[1] ? possiblePerson.phones[1].display : "",
                    "Mailing Address": possiblePerson.addresses[0] ? possiblePerson.addresses[0].display : "",
                    "Education": possiblePerson.educations[0] ? possiblePerson.educations[0].display : "",
                    "Job": possiblePerson.jobs[0] ? possiblePerson.jobs[0].display : ""
                }

                if (!possiblePerson.emails) {
                    const emailObject = await this.getEmailFromSearchPointer(row);
                    const combinedResult = Object.assign(row, emailObject);
                    const status = this.determineStatus(combinedResult);
                    return Object.assign(combinedResult, { "Status": status });
                } else {
                    const status = this.determineStatus(row);
                    return Object.assign(row, { "Status": status });
                }
            });
    }
    
    getEmailFromSearchPointer = async (row) => {
        return await fetch('/temp/search_pointer_response.json')
            .then(response => response.json())
            .then(json => {
                const possiblePerson = json.person;
                const emailObject = {
                    "Email1": (possiblePerson.emails || [])[0] ? possiblePerson.emails[0].address : "",
                    "Email2": (possiblePerson.emails || [])[1] ? possiblePerson.emails[1].address : "",
            };

            return emailObject;
        });
    };

    determineStatus = (row) => {
        let status = "Filled all fields";
        let missingColumns = [];
        for (let column in row) {
            if (!row[column]) {
                missingColumns.push(column);
            }
        }

        if (missingColumns.length) {
            status = "Unable to fill all fields";
        }

        return status;
    }

    render() {
        const { completedSearches, totalSearches } = this.state;
        
        let success = false;
        if (completedSearches === totalSearches) {
            success = true;
        }

        console.log({ success, completedSearches, totalSearches });

        return (
            <Modal
                id="progress-modal"
                open={this.state.open}
                size="tiny"
            >
            <Modal.Header>PROGRESS</Modal.Header>
            <Modal.Content className="progress-modal__content">
                <Progress value={completedSearches} total={totalSearches} active color="blue" success={success} />
            </Modal.Content>
            <Modal.Actions>
                <Button>Pause</Button>
                <Button color="yellow" onClick={this.close}>Exit</Button>
            </Modal.Actions>
          </Modal>
        );
    }
}

export default ProgressModal;