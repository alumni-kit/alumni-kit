import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";

class CompletionModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openCompletionModal });
    }

    close = () => this.props.App.setState({ openCompletionModal: false });

    render() {
        const { App } = this.props;
        return (
            <Modal
                id="progress-modal"
                open={this.state.open}
                size="tiny"
            >
            <Modal.Header>SEARCH COMPLETE</Modal.Header>
            <Modal.Content className="progress-modal__content">
                <p>{App.state.rows.length} successful matches</p>
            </Modal.Content>
            <Modal.Actions>
                <Button color="yellow" onClick={this.close}>Continue</Button>
            </Modal.Actions>
          </Modal>
        );
    }
}

export default CompletionModal;