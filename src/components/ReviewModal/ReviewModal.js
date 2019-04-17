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
                    {this.props.App.state.selectedRow.Status && this.props.App.state.selectedRow.Status.previousRow &&
                        <li>
                            <b>Fields:</b>
                            <ul>
                                {Object.entries(this.props.App.state.selectedRow).map((entry) => {
                                    const property = entry[0];
                                    const value = entry[1];
                                    const previousRow = this.props.App.state.selectedRow.Status.previousRow || {};
                                    if (typeof value !== "object" && previousRow[property] !== value) {
                                        return (
                                            <li>{property}: {previousRow[property] ||  <mark>previously blank</mark>} <Icon name="arrow right" /> {value || <mark>currently blank</mark>}</li>
                                        )
                                    } else if (typeof value !== "object") {
                                        return (
                                            <li>{property}: {JSON.stringify(value) || <mark>currently blank</mark>}</li>
                                        )
                                    }
                                })}
                            </ul>
                        </li>
                        ||
                        <li>
                            <b>Fields:</b>
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
                        </li>
                    }
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

    renderPossibleMatches = () => {
        if (this.props.App.state.selectedRow.Status) {
            return (
                <>
                    <Header>All Possible Matches</Header>
                    <Divider />
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
                                        <Card.Content>
                                            <List bulleted>
                                                {person.names && person.names[0] &&
                                                    (<List.Item>Names: {person.names.map(name => name.display).join(", ")}</List.Item>)
                                                }
                                                {person.gender && person.gender.content &&
                                                    (<List.Item>Gender: {person.gender.content}</List.Item>)
                                                }
                                                {person.dob &&
                                                    (<List.Item>Age: {person.dob.display}</List.Item>)
                                                }
                                                {person.usernames && person.usernames[0] &&
                                                    (<List.Item>Usernames: {person.usernames.map(username => username.content).join(", ")}</List.Item>)
                                                }
                                                {person.phones && person.phones[0] &&
                                                    (<List.Item>Phones: {person.phones.map(phone => phone.number).join(", ")}</List.Item>)
                                                }
                                                {person.emails && person.emails[0] &&
                                                    (<List.Item>Emails: {person.emails.map(email => email.address).join(", ")}</List.Item>)
                                                }
                                                {person.addresses && person.addresses[0] &&
                                                    (<List.Item>Addresses: {person.addresses.map(address => address.display).join(", ")}</List.Item>)
                                                }
                                                {person.educations && person.educations[0] &&
                                                    (<List.Item>Educations: {person.educations.map(education => education.display).join(", ")}</List.Item>)
                                                }
                                                {person.jobs && person.jobs[0] &&
                                                    (<List.Item>Jobs: {person.jobs.map(job => job.display).join(", ")}</List.Item>)
                                                }
                                            </List>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <Button onClick={this.openConfirmModal}>Replace</Button>
                                        </Card.Content>
                                    </Card>
                                )
                            })
                        }
                    </Card.Group>
                </>
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
                        {this.renderPossibleMatches()}
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