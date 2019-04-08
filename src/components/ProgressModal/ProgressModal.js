import React, { Component } from "react";
import { Button, Container, Modal, Progress } from "semantic-ui-react";
import qs from "qs";
import * as Promise from 'bluebird';
import promiseSerial from 'promise-serial';

class ProgressModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            completedSearches: 0,
            status: "Searching...",
            totalSearches: 1,
            pause: false,
            pauseIndex: 0,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openProgressModal, totalSearches: props.App.state.rows.length });

        if (props.openProgressModal) {
            this.startPiplSearch();
        }
    }

    close = () => {
        const { completedSearches, totalSearches } = this.state;
        this.props.App.setState({ openProgressModal: false, openEarlyExitModal: true, completedSearches, totalSearches });
        this.setState({ pause: true });
    }

    startPiplSearch = async (options) => {
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

        this.setState({ pause: false });

        const updatedRows = await rows.map((row, index) => {
            return () => {
                return new Promise(async (resolve, reject) => {
                    if (index < this.state.pauseIndex) {
                        return resolve('Skipping until we reach pause index');
                    }

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
                        if (key !== "First Name" && key !== "Last Name" && key !== "Mailing Address" && key !== "id" && key !== "Education" && key !== "Job" && key !== "Status") {
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
                    App.state.rows[index] = Object.assign(row, newRow);

                    if (this.state.pause) {
                        this.setState({ pauseIndex: index });
                        reject(`Paused at index: ${index}`);
                    }

                    this.setState({ completedSearches: index + 1 }, () => window.dispatchEvent(new Event('resize')));
                    resolve(Object.assign(row, newRow));
                });
            };
        });
 
        promiseSerial(updatedRows)
            .then(rows => {
                this.setState({ status: "Complete" });
                window.dispatchEvent(new Event('resize'));

                setTimeout(() => {
                    App.setState({ openProgressModal: false, openCompletionModal: true });
                }, 500);
            })
            .catch(err => console.warn(err));
    }
    
    getNewRow = async (queryString) => {
        const { App } = this.props;    
        return await Promise.delay(250).then(() =>  {
            return fetch('/temp/normal_response.json')
                .then(response => response.json())
                .then(async json => {
                    let possiblePerson;
                    if (json.person) {
                        possiblePerson = json.person;
                    } else if (json.possible_persons && json.possible_persons.length > 0) {
                        possiblePerson = json.possible_persons[0];
                    }

                    const row = {
                        "First Name": (possiblePerson.names || [])[0].first,
                        "Last Name": (possiblePerson.names || [])[0].last,
                        "Email1": (possiblePerson.emails || [])[0] ? possiblePerson.emails[0].address : "",
                        "Email2": (possiblePerson.emails || [])[1] ? possiblePerson.emails[1].address : "",
                        "Phone1": (possiblePerson.phones || [])[0] ? possiblePerson.phones[0].display : "",
                        "Phone2": (possiblePerson.phones || [])[1] ? possiblePerson.phones[1].display : "",
                        "Mailing Address": (possiblePerson.addresses || [])[0] ? possiblePerson.addresses[0].display : "",
                        "Education": (possiblePerson.educations || [])[0] ? possiblePerson.educations[0].display : "",
                        "Job": (possiblePerson.jobs || [])[0] ? possiblePerson.jobs[0].display : ""
                    }

                    if (!possiblePerson.emails) {
                        const {emailObject, searchPointerResponse } = await this.getEmailFromSearchPointer(row);
                        const combinedResult = Object.assign(row, emailObject);
                        const { status, missingColumns } = this.determineStatus(combinedResult);
                        return Object.assign(combinedResult, { "Status": { status, response: json, searchPointerResponse,  App, missingColumns } });
                    } else {
                        const { status, missingColumns } = this.determineStatus(row);
                        return Object.assign(row, { "Status": { status, response: json, App, missingColumns } });
                    }
                });
            });
    }
    
    getEmailFromSearchPointer = async (row) => {
        return await Promise.delay(250).then(() =>  {
            return fetch('/temp/search_pointer_response.json')
                .then(response => response.json())
                .then(json => {
                    const possiblePerson = json.person;
                    const emailObject = {
                        "Email1": (possiblePerson.emails || [])[0] ? possiblePerson.emails[0].address : "",
                        "Email2": (possiblePerson.emails || [])[1] ? possiblePerson.emails[1].address : "",
                };

                return { emailObject, searchPointerResponse: json };
            });
        });
    };

    determineStatus = (row) => {
        let status = "Complete";
        let missingColumns = [];
        for (let column in row) {
            if (!row[column]) {
                missingColumns.push(column);
            }
        }

        if (missingColumns.length) {
            status = "Partial";
        }

        return { status, missingColumns };
    }

    togglePauseResume = () => {
        const searchStatus = this.state.pause === false ? "Paused." : "Searching...";
        this.setState({
            pause: !this.state.pause,
            status: searchStatus,
        }, () => {
            if (!this.state.pause) {
                this.startPiplSearch();
            }
        });
    }

    render() {
        const { completedSearches, totalSearches } = this.state;
        
        let success = false;
        if (completedSearches === totalSearches) {
            success = true;
        }

        return (
            <Modal
                id="progress-modal"
                open={this.state.open}
                size="tiny"
            >
            <Modal.Header>PROGRESS</Modal.Header>
            <Modal.Content className="progress-modal__content">
                <Container textAlign="center">{this.state.status}</Container>
                <Progress percent={Math.round(completedSearches / totalSearches * 100)} active color="blue" success={success} progress="percent" />
                <Container textAlign="right">{completedSearches} / {totalSearches} searches</Container>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={this.togglePauseResume}>{this.state.pause ? "Resume" : "Pause"}</Button>
                <Button color="yellow" onClick={this.close}>Exit</Button>
            </Modal.Actions>
          </Modal>
        );
    }
}

export default ProgressModal;