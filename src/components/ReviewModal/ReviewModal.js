import { Button, Card, Image, List, Modal } from "semantic-ui-react";
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

    openConfirmModal = () => this.props.App.setState({ openReviewModal: false, openConfirmModal: true });

    render() {
        return (
            <>
                <Modal
                    id="review-modal"
                    closeIcon
                    onClose={this.close}
                    open={this.state.open}
                    size="tiny"
                >
                    <Modal.Header>Review</Modal.Header>
                    <Modal.Content className="review-modal__content">
                        <p>This is the review Modal</p>
                        <p>Selected row id: {this.props.App.state.selectedRow.id}</p>
                        <Card.Group>
                        {this.props.App.state.selectedRow.Status &&
                            this.props.App.state.selectedRow.Status.response &&
                                this.props.App.state.selectedRow.Status.response.possible_persons &&
                                this.props.App.state.selectedRow.Status.response.possible_persons.map((person) => {
                                    return (
                                        <Card fluid key={person['@search_pointer']}>
                                            <Card.Content>
                                                {person.images && person.images[0] &&
                                                    (<Image floated='right' size='mini' src={person.images[0].url} onError={(e) => console.log("Error!", e.target.style = "display: none")}/>)
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
                                                <Button onClick={this.openConfirmModal}>Start Follow-up Pipl Search</Button>
                                            </Card.Content>
                                        </Card>
                                    )
                                })
                        }
                        </Card.Group>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="yellow" onClick={this.close}>Cancel</Button>
                    </Modal.Actions>
                </Modal>
            </>
        );
    }
}

export default ReviewModal;