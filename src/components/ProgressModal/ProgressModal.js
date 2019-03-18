import React, { Component } from "react";
import { Button, Modal } from "semantic-ui-react";

class ProgressModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openProgressModal });
    }

    close = () => this.props.App.setState({ openProgressModal: false });

    render() {
        return (
            <Modal
                id="progress-modal"
                closeIcon
                onClose={this.close}
                open={this.state.open}
                size="tiny"
            >
            <Modal.Header>PROGRESS</Modal.Header>
            <Modal.Content className="progress-modal__content">
            </Modal.Content>
            <Modal.Actions>
                <Button>Pause</Button>
                <Button color="yellow" onClick={this.close}>Exit</Button>
            </Modal.Actions>
          </Modal>
        );
    }
}

export default ProgressModal;