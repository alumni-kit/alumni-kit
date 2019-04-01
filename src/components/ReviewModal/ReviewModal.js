import { Button, Modal } from "semantic-ui-react";
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
                        <p>Selected row: {this.props.App.state.selectedRow.id}</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.openConfirmModal}>Start Pipl Search</Button>
                        <Button color="yellow" onClick={this.close}>Cancel</Button>
                    </Modal.Actions>
                </Modal>
            </>
        );
    }
}

export default ReviewModal;