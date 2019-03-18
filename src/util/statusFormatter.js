import { Button, Icon } from 'semantic-ui-react';
import React from 'react';

const StatusFormatter = ({ value }) => {
    if (value === "Complete") {
        return (<Button color="green"><Icon name="checkmark" /> Review</Button>);
    } else if (value === "Partial") {
        return (<Button color="yellow"><Icon name="warning sign" /> Review</Button>);
    } else if (value === "Error") {
        return (<Button color="red"><Icon name="remove" /> Review</Button>);
    } else {
        return value;
    }
}

export default StatusFormatter;