import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";

class EarlyExitModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openEarlyExitModal });
    }

    close = () => this.props.App.setState({ openEarlyExitModal: false });

    render() {
        const { App } = this.props;
        return (
            <Modal
                id="progress-modal"
                open={this.state.open}
                size="tiny"
            >
            <Modal.Header>SEARCH EXITED</Modal.Header>
            <Modal.Content className="progress-modal__content">
                <p>{App.state.completedSearches} completed searches</p>
                <p>{App.state.totalSearches - App.state.completedSearches} rows left unsearched</p>
            </Modal.Content>
            <Modal.Actions>
                <Button color="yellow" onClick={this.close}>Continue</Button>
            </Modal.Actions>
          </Modal>
        );
    }
}

export default EarlyExitModal;