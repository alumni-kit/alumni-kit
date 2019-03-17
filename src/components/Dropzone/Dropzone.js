import React, {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

const csvtojson = window.require("csvtojson");

const Dropzone = props => {
    const { App } = props;
    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            const csvString = reader.result
            csvtojson()
                .fromString(csvString)
                .on('header', (headers) => {
                    const columns = headers.map((header) => {
                        return {
                        editable: false,
                        key: header,
                        name: header,
                        };
                    });
                    App.setState({ columns });
                })
                .then((rowsFromCSV)=>{
                    const rows = rowsFromCSV.map((row, index) => {
                        row.id = index;
                        return row;
                    });
    
                    App.setState({ filePath: acceptedFiles[0].path, rows });
                });
        };

        reader.readAsText(acceptedFiles[0]);
    }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: '.csv',
        multiple: false,
        onDrop
    });

    return (
    <div id="dropzone">
        <Segment id="dropzone__segment" placeholder {...getRootProps()}>
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