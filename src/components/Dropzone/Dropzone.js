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
                    const requiredFields = {
                        "id": "id",
                        "Status": "Status",
                        "First Name": "First Name",
                        "Last Name": "Last Name",
                        "Email1": "Email1",
                        "Email2": "Email2",
                        "Phone1": "Phone1",
                        "Phone2": "Phone2",
                        "Mailing Address": "Mailing Address",
                        "Education": "Education",
                        "Job": "Job"
                      }
                      const mergedHeaders = Object.assign(requiredFields, ...headers.map(header => ({[header]: header})));
                      const mergedHeadersArray = Object.keys(mergedHeaders);
  
                      const columns = mergedHeadersArray.map((header) => {
                        let column = {
                          editable: false,
                          key: header,
                          name: header,
                        };

                        // Set the width of the id column
                        if (header === "id") {
                            column = Object.assign(column, { width: 50 });
                        }

                        return column;
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