import { Button, Card, Divider, Header, Icon, Image, List, Modal } from "semantic-ui-react";
import React, { Component } from 'react';

class ReviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openReviewModal });
    }

    close = () => this.props.App.setState({ openReviewModal: false });

    openConfirmModal = () => this.props.App.setState({ openReviewModal: false, openConfirmModal: true, rows: [this.props.App.state.selectedRow] });

    renderStatus = () => {
        return (
            <>
                <Header>Status: {this.props.App.state.selectedRow.Status && this.props.App.state.selectedRow.Status.status || "Not yet searched"}</Header>
                <Divider />
                <ul>
                    <li><b>Fields:</b>
                        {this.props.App.state.selectedRow.Status && this.props.App.state.selectedRow.Status.previousRow &&
                            <ul>
                                {Object.entries(this.props.App.state.selectedRow).map((entry) => {
                                    const property = entry[0];
                                    const value = entry[1];
                                    const previousRow = this.props.App.state.selectedRow.Status.previousRow || {};
                                    if (typeof value !== "object" && previousRow[property] !== value) {
                                        return (
                                            <li>{property}: {previousRow[property] ||  <mark>previously blank</mark>} <Icon name="arrow right" /> {value || <mark>currently blank</mark>}</li>
                                        )
                                    }
                                })}
                            </ul>
                        ||
                            <ul>
                                {Object.entries(this.props.App.state.selectedRow).map((entry) => {
                                    const property = entry[0];
                                    const value = entry[1];
                                    if (typeof value !== "object") {
                                        return (
                                            <li>{property}: {value || <mark>currently blank</mark>}</li>
                                        )
                                    }
                                })}
                            </ul>
                        }
                    </li>
                    {this.props.App.state.selectedRow.Status && this.props.App.state.selectedRow.Status.missingColumns &&
                        this.props.App.state.selectedRow.Status.missingColumns.length > 0 &&
                        <li><b>Missing Fields:</b>
                            <ul>
                                {this.props.App.state.selectedRow.Status.missingColumns.map(missingColumn => (
                                    <li>{missingColumn}</li>
                                ))}
                            </ul>
                        </li>
                    }
                    {this.props.App.state.selectedRow.Status && this.props.App.state.selectedRow.Status.status === "Error" &&
                        <li>
                            <b>Message:</b>
                            {this.props.App.state.selectedRow.Status.response && (this.props.App.state.selectedRow.Status.response.message || this.props.App.state.selectedRow.Status.response.error) &&
                                <ul>
                                    <li>
                                        <b>Initial Search: </b>
                                        {this.props.App.state.selectedRow.Status.response["@http_status_code"] &&
                                            <span>{this.props.App.state.selectedRow.Status.response["@http_status_code"]} - </span>
                                        }
                                        {this.props.App.state.selectedRow.Status.response.message || this.props.App.state.selectedRow.Status.response.error}
                                    </li>
                                </ul>
                            }
                            {this.props.App.state.selectedRow.Status.searchPointerResponse && this.props.App.state.selectedRow.Status.searchPointerResponse.message &&                
                                <ul>
                                    <li>
                                        <b>Follow-Up Search: </b>
                                        {this.props.App.state.selectedRow.Status.searchPointerResponse.message}
                                    </li>
                                </ul>
                            }
                        </li>
                    }
                </ul>
            </>
        )
    }

    renderCurrentMatch = () => {
        let searchPointerPerson = null;
        if (this.props.App.state.selectedRow.Status &&
            this.props.App.state.selectedRow.Status.searchPointerResponse &&
            this.props.App.state.selectedRow.Status.searchPointerResponse.person) {
                searchPointerPerson = this.props.App.state.selectedRow.Status.searchPointerResponse.person;
        }

        if (searchPointerPerson) {
            return (
                <Card.Group>
                    <Card fluid color="green">
                        <Card.Content>
                            <Card.Header>Current match:</Card.Header>
                            {searchPointerPerson.images && searchPointerPerson.images[0] &&
                                (<Image floated='right' size='mini' src={searchPointerPerson.images[0].url} onError={e => e.target.style = "display: none"}/>)
                            }
                            {searchPointerPerson.names && searchPointerPerson.names[0] &&
                                (<Card.Header>{searchPointerPerson.names[0].display}</Card.Header>)
                            }
                        </Card.Content>
                        {(searchPointerPerson.dob || searchPointerPerson.educations || searchPointerPerson.jobs) &&
                            <Card.Content>
                                <List bulleted>
                                    {searchPointerPerson.dob &&
                                        (<List.Item>{searchPointerPerson.dob.display}</List.Item>)
                                    }
                                    {searchPointerPerson.educations && searchPointerPerson.educations[0] &&
                                        (<List.Item>{searchPointerPerson.educations[0].display}</List.Item>)
                                    }
                                    {searchPointerPerson.jobs && searchPointerPerson.jobs[0] &&
                                        (<List.Item>{searchPointerPerson.jobs[0].display}</List.Item>)
                                    }
                                </List>
                            </Card.Content>
                        }
                    </Card>
                </Card.Group>
            )
        }
    }

    renderPossibleMatches = () => {
        if (this.props.App.state.selectedRow.Status) {
            return (
                <Card.Group>
                    {this.props.App.state.selectedRow.Status.response &&
                        this.props.App.state.selectedRow.Status.response.possible_persons &&
                        this.props.App.state.selectedRow.Status.response.possible_persons.map((person) => {
                            return (
                                <Card fluid key={person['@search_pointer']}>
                                    <Card.Content>
                                        {person.images && person.images[0] &&
                                            (<Image floated='right' size='mini' src={person.images[0].url} onError={e =>  e.target.style = "display: none"}/>)
                                        }
                                        {person.names && person.names[0] &&
                                            (<Card.Header>{person.names[0].display}</Card.Header>)
                                        }
                                        {person['@match'] &&
                                            (<Card.Meta>Match confidence level: {person['@match']}</Card.Meta>)
                                        }
                                    </Card.Content>
                                    {(person.dob || person.educations || person.jobs) &&
                                        <Card.Content>
                                            <List bulleted>
                                                {person.dob &&
                                                    (<List.Item>{person.dob.display}</List.Item>)
                                                }
                                                {person.educations && person.educations[0] &&
                                                    (<List.Item>{person.educations[0].display}</List.Item>)
                                                }
                                                {person.jobs && person.jobs[0] &&
                                                    (<List.Item>{person.jobs[0].display}</List.Item>)
                                                }
                                            </List>
                                        </Card.Content>
                                    }
                                    <Card.Content extra>
                                        <Button onClick={this.openConfirmModal}>Replace</Button>
                                    </Card.Content>
                                </Card>
                            )
                        })
                    }
                </Card.Group>
            )
        }
    }

    render() {
        return (
            <>
                <Modal
                    id="review-modal"
                    closeIcon
                    onClose={this.close}
                    open={this.state.open}
                    size="large"
                >
                    <Modal.Header>Review</Modal.Header>
                    <Modal.Content className="review-modal__content">
                        {this.renderStatus()}
                        {/* {this.renderCurrentMatch()} */}
                        {/* {this.renderPossibleMatches()} */}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="blue" onClick={this.openConfirmModal}>{this.props.App.state.selectedRow["Last Update"] ? "Retry" : "Search"}</Button>
                        <Button color="yellow" onClick={this.close}>Cancel</Button>
                    </Modal.Actions>
                </Modal>
            </>
        );
    }
}

export default ReviewModal;