import { Button, Icon } from 'semantic-ui-react';
import React from 'react';

const StatusFormatter = props => {
    const { value } = props;
    if (value.status) {
        return value.status;
    } else {
        return value;
    }
}

export default StatusFormatter;