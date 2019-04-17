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

    openPossibleMatchesModal = () => this.props.App.setState({ openReviewModal: false, openPossibleMatchesModal: true, rows: [this.props.App.state.selectedRow] });

    renderStatus = () => {
        return (
            <>
                <Header>Status: {this.props.App.state.selectedRow.Status && this.props.App.state.selectedRow.Status.status || "Not yet searched"} </Header>
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
                                            <li>{property}: {previousRow[property] ||  "previously blank"} <Icon name="arrow right" /> <mark>{JSON.stringify(value) || "currently blank"}</mark></li>
                                        )
                                    } else if (typeof value !== "object") {
                                        return (
                                            <li>{property}: {JSON.stringify(value) || "currently blank"}</li>
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
                                            <li>{property}: {((value === 0) ? "0" : value) || "currently blank"}</li>
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

    render() {
        return (
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
                </Modal.Content>
                <Modal.Actions>
                    {this.props.App.state.selectedRow.Status &&
                        this.props.App.state.selectedRow.Status.response &&
                            this.props.App.state.selectedRow.Status.response.possible_persons &&
                                <Button color="blue" onClick={this.openPossibleMatchesModal}>Show All Possible Matches</Button>
                    }
                    <Button color="blue" onClick={this.openConfirmModal}>{this.props.App.state.selectedRow["Last Update"] ? "Retry" : "Search"}</Button>
                    <Button color="yellow" onClick={this.close}>Cancel</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default ReviewModal;