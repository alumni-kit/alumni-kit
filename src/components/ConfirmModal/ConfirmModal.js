import { Button, Icon, Modal, Popup } from "semantic-ui-react";
import React, { Component } from 'react';

class ConfirmModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openConfirmModal });
    }

    calculateEstimatedCost = () => {
        const { App } = this.props;

        const numberOfSearches = App.state.rows.length;
        let chargePerSearch = 0.80;

        if (App.state.selectedSearchPointer) {
            chargePerSearch = 0.40;
        }

        const estimatedCost = (numberOfSearches * chargePerSearch).toFixed(2);

        return estimatedCost;
    }

    close = () => this.props.App.setState({ openConfirmModal: false });

    openProgressModal = () => this.props.App.setState({ openConfirmModal: false, openProgressModal: true });

    render() {
        const { App } = this.props;
        let estimateHelper = `${App.state.rows.length} row(s) x ($0.40/initial search + $0.40/follow up search) ~= $${this.calculateEstimatedCost()}`;

        if (App.state.selectedSearchPointer) {
            estimateHelper = `${App.state.rows.length} row(s) x ($0.40/follow up search) ~= $${this.calculateEstimatedCost()}`;
        }
        return (
            <>
                <Modal
                    id="confirm-modal"
                    closeIcon
                    onClose={this.close}
                    open={this.state.open}
                    size="tiny"
                >
                    <Modal.Header>Confirm</Modal.Header>
                    <Modal.Content className="confirm-modal__content">
                        <p>{App.state.rows.length} row(s) to search</p>
                        <b>Estimated Cost: ${this.calculateEstimatedCost()} <Popup trigger={<Icon name="info circle" />} content={estimateHelper} /></b>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary onClick={this.openProgressModal}>Start Pipl Search</Button>
                        <Button color="yellow" onClick={this.close}>Cancel</Button>
                    </Modal.Actions>
                </Modal>
            </>
        );
    }
}

export default ConfirmModal;