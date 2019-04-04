import { Button, Icon } from 'semantic-ui-react';
import React from 'react';

const openReviewModal = ({ row, value }) => {
    const { App } = value;
    App.setState({ openReviewModal: true, selectedRow: row });
}

const StatusFormatter = props => {
    const { value } = props;
    if (value.status === "Complete") {
        return (<Button color="green" onClick={openReviewModal.bind(this, props)}><Icon name="checkmark" /> Review</Button>);
    } else if (value.status === "Partial") {
        return (<Button color="yellow" onClick={openReviewModal.bind(this, props)}><Icon name="warning sign" /> Review</Button>);
    } else if (value.status === "Error") {
        return (<Button color="red" onClick={openReviewModal.bind(this, props)}><Icon name="remove" /> Review</Button>);
    } else {
        return value;
    }
}

export default StatusFormatter;