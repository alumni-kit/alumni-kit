const StatusFormatter = ({value}) => {
    if (value.status) {
        return value.status;
    } else {
        return value;
    }
}

export default StatusFormatter;