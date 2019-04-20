import React, { Component } from "react";
import { Button, Dimmer, Loader, Modal } from "semantic-ui-react";

class EarlyExitModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dimmerActive: true,
            completedSearches: 0,
            partialSearches: 0,
            errorSearches: 0,
            open: false
        }
    }

    componentWillReceiveProps(props) {
        const { App } = props;

        this.setState({ open: props.openEarlyExitModal, dimmerActive: true });

        setTimeout(() => {
            let completedSearches = 0;
            let partialSearches = 0;
            let errorSearches = 0;
            App.state.totalRows.forEach(row => {
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
                <Dimmer active={this.state.dimmerActive}>
                    <Loader />
                </Dimmer>
                {this.props.App.state.rows.length === 1 ?
                    <>
                        {this.state.completedSearches ?
                            <p>{this.state.completedSearches} complete match</p> : ""                     
                        }
                        {this.state.partialSearches ?
                            <p>{this.state.partialSearches} partial match</p> : ""
                        }
                        {this.state.errorSearches ?
                            <p>{this.state.errorSearches} error</p> : ""
                        }
                    </>
                :
                    <>
                        <p>{this.state.completedSearches} complete match{this.state.completedSearches.length === 1 ? "" : "es"}</p>
                        <p>{this.state.partialSearches} partial match{this.state.partialSearches.length === 1 ? "" : "es"}</p>
                        <p>{this.state.errorSearches} error{this.state.errorSearches.length === 1 ? "" : "s"}</p>
                    </>
                }
                <p>{App.state.totalRows.length - (this.state.completedSearches + this.state.partialSearches + this.state.errorSearches)} row(s) left unsearched</p>
            </Modal.Content>
            <Modal.Actions>
                <Button color="yellow" onClick={this.close}>Exit</Button>
            </Modal.Actions>
          </Modal>
        );
    }
}

export default EarlyExitModal;