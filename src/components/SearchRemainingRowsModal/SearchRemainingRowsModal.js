import { Button, Modal } from "semantic-ui-react";
import React, { Component } from 'react';

class SearchRemainingRowsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            remainingRows: [],
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ open: props.openSearchRemainingRowsModal });

        const { totalRows } = this.props.App.state;
        const remainingRows = [];

        totalRows.forEach(row => {
            if (!row.Status) {
                remainingRows.push(row);
            }
        });

        this.setState({ remainingRows });
    }

    close = () => this.props.App.setState({ openSearchRemainingRowsModal: false });

    openConfirmModal = () => this.props.App.setState({ openSearchRemainingRowsModal: false, openConfirmModal: true });

    searchAllRows = () => {
        const { totalRows } = this.props.App.state;
        this.props.App.setState({ rows: totalRows });
        this.openConfirmModal();
    }

    searchRemainingRows = () => {
        this.props.App.setState({ rows: this.state.remainingRows });
        this.openConfirmModal();
    }

    render() {
        return (
            <>
                <Modal
                    id="search-remaining-rows-modal"
                    closeIcon
                    onClose={this.close}
                    open={this.state.open}
                    size="tiny"
                >
                    <Modal.Header>SearchRemainingRowsModal</Modal.Header>
                    <Modal.Content className="search-remaining-rows-modal__content">
                        <p>There are {this.state.remainingRows.length} rows still unsearched. Would you like to search the remaining rows?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary onClick={this.searchRemainingRows}>Search remaining rows</Button>
                        <Button primary onClick={this.searchAllRows}>Search all rows</Button>
                        <Button color="yellow" onClick={this.close}>Cancel</Button>
                    </Modal.Actions>
                </Modal>
            </>
        );
    }
}

export default SearchRemainingRowsModal;