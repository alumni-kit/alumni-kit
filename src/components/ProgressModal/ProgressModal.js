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
            totalSearches: 1,
            pause: false,
            pauseIndex: 0,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openProgressModal, totalSearches: props.App.state.rows.length });

        if (props.openProgressModal && !this.props.openProgressModal) {
            this.setState({ completedSearches: 0, pauseIndex: 0 });
            this.startPiplSearch();
        }
    }

    close = () => {
        this.props.App.setState({ openProgressModal: false, openEarlyExitModal: true });
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
                        names: []
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
                        if (
                            key === "Email1" ||
                            key === "Email2" ||
                            key === "Phone1" ||
                            key === "Phone2"
                        ) {
                            if (row[key]) {
                                const arrayProperty = propertyDictionary[key];
                                if (key === "Phone1" || key === "Phone2") {
                                    if (!person.phones) {
                                        person.phones = [];
                                    }
                                    person[arrayProperty].push({ raw: row[key] });
                                } else if (key === "Email1" || key === "Email2") {
                                    if (!person.emails) {
                                        person.emails = [];
                                    }
                                    person[arrayProperty].push({ address: row[key] });
                                }
                            }
                        }
                    }
        
                    if (row["Mailing Address"]) {
                        person.addresses = [];
                        person.addresses.push({ raw: row["Mailing Address"] });
                    }
        
                    const previousRow = {};

                    for (let column in row) {
                        if (column !== "Status") {
                            previousRow[column] = row[column];
                        }
                    }

                    const requestObject = { person: JSON.stringify(person), key: App.state.piplApiKey };
                    const queryString = qs.stringify(requestObject);
                    let combinedResult;
                
                    if (App.state.selectedSearchPointer) {
                        // If the initial request is missing emails, conduct a follow-up with the first search pointer
                        const searchPointerResponse = await this.getSearchPointerResponse(App.state.selectedSearchPointer);
                        const searchPointerResponsePerson = searchPointerResponse.person;
                        combinedResult = Object.assign(row, {
                            "First Name": (searchPointerResponsePerson.names || [])[0] ? searchPointerResponsePerson.names[0].first : row["First Name"],
                            "Last Name": (searchPointerResponsePerson.names || [])[0] ? searchPointerResponsePerson.names[0].last : row["Last Name"],
                            "Email1": (searchPointerResponsePerson.emails || [])[0] ? searchPointerResponsePerson.emails[0].address : row["Email1"],
                            "Email2": (searchPointerResponsePerson.emails || [])[1] ? searchPointerResponsePerson.emails[1].address : row["Email2"],
                            "Phone1": (searchPointerResponsePerson.phones || [])[0] ? searchPointerResponsePerson.phones[0].number : row["Phone1"],
                            "Phone2": (searchPointerResponsePerson.phones || [])[1] ? searchPointerResponsePerson.phones[1].display : row["Phone2"],
                            "Mailing Address": (searchPointerResponsePerson.addresses || [])[0] ? searchPointerResponsePerson.addresses[0].display : row["Mailing Address"],
                            "Education": (searchPointerResponsePerson.educations || [])[0] ? searchPointerResponsePerson.educations[0].display : row["Education"],
                            "Job": (searchPointerResponsePerson.jobs || [])[0] ? searchPointerResponsePerson.jobs[0].display : row["Job"]
                        });

                        let { status, missingColumns } = this.determineStatus(combinedResult);

                        if (searchPointerResponse instanceof Error) {
                            App.showToast("error", `Error: ${searchPointerResponse}`);
                            status = "Error";
                        }

                        combinedResult = Object.assign(
                            combinedResult,
                            {
                                "Status": { status, response: row.Status.response, searchPointerResponse,  missingColumns, previousRow },
                                "Last Update": new Date().toLocaleString(),
                            }
                        );
                    } else {
                        // Performs initial request
                        const { newRow, response } = await this.getNewRow(queryString);

                        // If the initial request is missing emails, conduct a follow-up with the first search pointer
                        if (newRow && !newRow.emails && !(response instanceof Error)) {
                            const person = response.person || response.possible_persons[0];
                            const searchPointer = person['@search_pointer'];
                            const searchPointerResponse = await this.getSearchPointerResponse(searchPointer);
                            const searchPointerResponsePerson = searchPointerResponse.person;
                            const emailObject = {
                                "Email1": (searchPointerResponsePerson && searchPointerResponsePerson.emails || [])[0] ? searchPointerResponsePerson.emails[0].address : "",
                                "Email2": (searchPointerResponsePerson && searchPointerResponsePerson.emails || [])[1] ? searchPointerResponsePerson.emails[1].address : "",
                            };
    
                            combinedResult = Object.assign(row, newRow, emailObject);
                            let { status, missingColumns } = this.determineStatus(combinedResult);
    
                            if (searchPointerResponse instanceof Error) {
                                // Show an error toast and store the response
                                App.showToast("error", `Error: ${searchPointerResponse}`);
                                status = "Error";
                            }
    
                            combinedResult = Object.assign(
                                combinedResult,
                                {
                                    "Status": { status, response, searchPointerResponse,  missingColumns, previousRow },
                                    "Last Update": new Date().toLocaleString(),
                                }
                            );
                        } else {
                            combinedResult = Object.assign(row, newRow);
                            const { status, missingColumns } = this.determineStatus(combinedResult);
                            combinedResult = Object.assign(
                                combinedResult,
                                { "Status": { status, response, missingColumns, previousRow },
                                "Last Update": new Date().toLocaleString()
                            });
                        }
                    }


                    // Write it to the main table
                    App.state.totalRows[row.id] = combinedResult;
                    this.setState({ completedSearches: index + 1 }, () => window.dispatchEvent(new Event('resize')));

                    // Return the selectedSearchPointer back to its default value
                    App.setState({ selectedSearchPointer: '' });

                    // If we're paused, break out of this series
                    if (this.state.pause) {
                        this.setState({ pauseIndex: index });
                        reject(`Paused at index: ${index}`);
                    }

                    resolve(Object.assign(row, combinedResult));
                });
            };
        });
 
        promiseSerial(updatedRows)
            .then(() => {
                window.dispatchEvent(new Event('resize'));

                setTimeout(() => {
                    App.setState({ openProgressModal: false, openCompletionModal: true });
                }, 500);
            })
            .catch(err => console.warn(err));
    }
    
    getNewRow = async (queryString) => {
        return await Promise.delay(100).then(() =>  {
            const url = `https://api.pipl.com/search/?${queryString}`;
            const options = {
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-store'
                }
            };

            return fetch(url, options)
                .then(response => response.json())
                .then(async json => {
                    // If the response is a valid http response, but the code is an error
                    if (json && json["@http_status_code"] && json["@http_status_code"] !== 200) {
                        // Show an error toast and store the response
                        const { App } = this.props;
                        App.showToast("error", `Error code: ${json["@http_status_code"]}, ${json["error"]}`);
                        return {
                            newRow: {
                                "Status": { status: "Error", response: json },
                                "Last Update": new Date().toLocaleString(),
                            },
                            response: new Error(`Error code: ${json["@http_status_code"]}, ${json["error"]}`),
                        };
                    }

                    // A response can either have an exact match, or a list of possible matches.
                    // Take the first of possible matches if an exact match is not found.
                    let possiblePerson;
                    let numberOfPossibleMatches = 0;
                    if (json.person) {
                        possiblePerson = json.person;
                        numberOfPossibleMatches = 1;
                    } else if (json.possible_persons && json.possible_persons.length > 0) {
                        possiblePerson = json.possible_persons[0];
                        numberOfPossibleMatches = json.possible_persons.length;
                    }

                    return {
                        newRow: {
                            "Number of Possible Matches": numberOfPossibleMatches || 0,
                            "First Name": (possiblePerson.names || [])[0] ? possiblePerson.names[0].first : "",
                            "Last Name": (possiblePerson.names || [])[0] ? possiblePerson.names[0].last : "",
                            "Email1": (possiblePerson.emails || [])[0] ? possiblePerson.emails[0].address : "",
                            "Email2": (possiblePerson.emails || [])[1] ? possiblePerson.emails[1].address : "",
                            "Phone1": (possiblePerson.phones || [])[0] ? possiblePerson.phones[0].number : "",
                            "Phone2": (possiblePerson.phones || [])[1] ? possiblePerson.phones[1].display : "",
                            "Mailing Address": (possiblePerson.addresses || [])[0] ? possiblePerson.addresses[0].display : "",
                            "Education": (possiblePerson.educations || [])[0] ? possiblePerson.educations[0].display : "",
                            "Job": (possiblePerson.jobs || [])[0] ? possiblePerson.jobs[0].display : ""
                        },
                        response: json,
                    }
                })
                .catch(err => {
                    // Show an error toast and store the response
                    const { App } = this.props;
                    App.showToast("error", `Error message: ${err.message}, Error stack: ${err.stack}`);
                    return {
                        newRow: {
                            "Status": { status: "Error", response: err },
                            "Last Update": new Date().toLocaleString(),
                        },
                        response: err,
                    };
                });
            });
    }
    
    getSearchPointerResponse = async (searchPointer) => {
        return await Promise.delay(100).then(() =>  {
            const { App } = this.props;
            const queryObject = {
                key: App.state.piplApiKey,
            }
            const searchPointerQueryObject = {
                search_pointer: searchPointer,
            }
            const queryString = qs.stringify(queryObject);
            const searchPointerQueryString = qs.stringify(searchPointerQueryObject);

            const searchParameters = new URLSearchParams(searchPointerQueryString);

            const url = `https://api.pipl.com/search/?${queryString}`;
            const options = {
                method: 'POST',
                body: searchParameters,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cache-Control': 'no-store'
                }
            };

            return fetch(url, options)
                .then(response => response.json())
                .catch(err => err);
        });
    };

    determineStatus = (row = {}) => {
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

        // Don't overwrite an error
        if (row.Status && row.Status.status === "Error") {
            status = "Error";
        }

        return { status, missingColumns };
    }

    togglePauseResume = () => {
        this.setState({
            pause: !this.state.pause,
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
                <Progress percent={Math.round(completedSearches / totalSearches * 100)} active color="blue" success={success} progress="percent" />
                <Container textAlign="right">{completedSearches} / {totalSearches} rows searched</Container>
            </Modal.Content>
            <Modal.Actions>
                <Button primary onClick={this.togglePauseResume}>{this.state.pause ? "Resume" : "Pause"}</Button>
                <Button color="yellow" onClick={this.close}>Exit</Button>
            </Modal.Actions>
          </Modal>
        );
    }
}

export default ProgressModal;