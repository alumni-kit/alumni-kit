import { Button, Card, Image, List, Modal } from "semantic-ui-react";
import React, { Component } from 'react';

class PossibleMatchesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openPossibleMatchesModal });
    }

    close = () => this.props.App.setState({ openPossibleMatchesModal: false });

    openConfirmModal = () => this.props.App.setState({ openPossibleMatchesModal: false, openConfirmModal: true, rows: [this.props.App.state.selectedRow] });
    
    replaceWithNewSearchPointer = (searchPointer) => {
        this.props.App.setState({ openPossibleMatchesModal: false, openConfirmModal: true, rows: [this.props.App.state.selectedRow], selectedSearchPointer: searchPointer });
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
                                            (<Card.Meta>Match Confidence: {person['@match']}</Card.Meta>)
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
                                                (
                                                    <List.Item>Phones:
                                                        <List bulleted>
                                                            {person.phones.map(phone => <List.Item>{phone.display}</List.Item>)}
                                                        </List>
                                                    </List.Item>
                                                )
                                            }
                                            {person.emails && person.emails[0] &&
                                                (
                                                    <List.Item>Emails:
                                                        <List bulleted>
                                                            {person.emails.map(email => <List.Item>{email.address}</List.Item>)}
                                                        </List>
                                                    </List.Item>
                                                )
                                            }
                                            {person.addresses && person.addresses[0] &&
                                                (
                                                    <List.Item>Addresses:
                                                        <List bulleted>
                                                            {person.addresses.map(address => <List.Item>{address.display}</List.Item>)}
                                                        </List>
                                                    </List.Item>
                                                )
                                            }
                                            {person.educations && person.educations[0] &&
                                                (
                                                    <List.Item>Educations:
                                                        <List bulleted>
                                                            {person.educations.map(education => <List.Item>{education.display}</List.Item>)}
                                                        </List>
                                                    </List.Item>
                                                )
                                            }
                                            {person.jobs && person.jobs[0] &&
                                                (
                                                    <List.Item>Jobs:
                                                        <List bulleted>
                                                            {person.jobs.map(job => <List.Item>{job.display}</List.Item>)}
                                                        </List>
                                                    </List.Item>
                                                )
                                            }
                                        </List>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Button onClick={this.replaceWithNewSearchPointer.bind(this, person['@search_pointer'])}>Update row with this match</Button>
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
            <Modal
                id="possible-matches-modal"
                closeIcon
                onClose={this.close}
                open={this.state.open}
                size="large"
            >
                <Modal.Header>All Possible Matches</Modal.Header>
                <Modal.Content className="possible-matches-modal__content">
                    {this.renderPossibleMatches()}
                </Modal.Content>
                <Modal.Actions>
                    <Button color="yellow" onClick={this.close}>Cancel</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default PossibleMatchesModal;