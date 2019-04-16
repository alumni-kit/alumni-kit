import React, { Component } from "react";
import { Button, Dimmer, Loader, Modal } from "semantic-ui-react";

class CompletionModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dimmerActive: true,
            completedSearches: null,
            partialSearches: null,
            errorSearches: null,
            open: false
        }
    }

    componentWillReceiveProps(props) {
        const { App } = props;

        this.setState({ open: props.openCompletionModal });

        setTimeout(() => {
            let completedSearches = 0;
            let partialSearches = 0;
            let errorSearches = 0;
            App.state.rows.forEach(row => {
                if (typeof row.Status === "object" && row.Status.status && row["Last Update"]) {
                    if (row.Status.status === "Complete") {
                        completedSearches++;
                    }

                    if (row.Status.status === "Partial") {
                        partialSearches++;
                    }

                    if (row.Status.status === "Error") {
                        errorSearches++;
                    }
                }
            });
            this.setState({ completedSearches, partialSearches, errorSearches, dimmerActive: false });
        }, 500);
    }

    close = () => this.props.App.setState({ openCompletionModal: false });

    render() {
        return (
            <Modal
                id="progress-modal"
                open={this.state.open}
                size="tiny"
            >
            <Modal.Header>SEARCH COMPLETE</Modal.Header>
            <Modal.Content className="progress-modal__content">
                <Dimmer active={this.state.dimmerActive}>
                    <Loader />
                </Dimmer>
                <p>{this.state.completedSearches} complete matches</p>
                <p>{this.state.partialSearches} partial matches</p>
                <p>{this.state.errorSearches} errors</p>
            </Modal.Content>
            <Modal.Actions>
                <Button color="yellow" onClick={this.close}>Continue</Button>
            </Modal.Actions>
          </Modal>
        );
    }
}

export default CompletionModal;