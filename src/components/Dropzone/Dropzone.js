import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';
import importCSV from 'util/importCSV/importCSV';

const Dropzone = props => {
    const { App } = props;
    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            const csvString = reader.result
            importCSV({App, csvString, filePath: acceptedFiles[0].path});
        };

        reader.readAsText(acceptedFiles[0]);
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: '.csv',
        multiple: false,
        onDrop
    });

    return (
    <div id="dropzone" {...getRootProps()}>
        <Segment id="dropzone__segment" placeholder>
            <Header icon>
                <Icon name='table' />
                {
                    isDragActive ?
                    "Drop the files here" :
                    "Drag and drop a .csv file here"
                }
            </Header>
            <Button primary>Add .csv</Button>
            <input {...getInputProps()} />
        </Segment>
    </div>
  )
}

export default Dropzone;