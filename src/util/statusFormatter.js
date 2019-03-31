import { Button, Icon } from 'semantic-ui-react';
import React from 'react';

const openReviewModal = App => {
    App.setState({ openReviewModal: true });
}

const StatusFormatter = ({ value }) => {
    const App = value.App;
    if (value.status === "Complete") {
        return (<Button color="green" onClick={openReviewModal.bind(this, App)}><Icon name="checkmark" /> Review</Button>);
    } else if (value.status === "Partial") {
        return (<Button color="yellow" onClick={openReviewModal.bind(this, App)}><Icon name="warning sign" /> Review</Button>);
    } else if (value.status === "Error") {
        return (<Button color="red" onClick={openReviewModal.bind(this, App)}><Icon name="remove" /> Review</Button>);
    } else {
        return value;
    }
}

export default StatusFormatter;