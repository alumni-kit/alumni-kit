import generateMenu from './util/generateMenu';
import React, { Component } from 'react';
import ReactDataGrid from "react-data-grid";
import qs from "qs";
import './App.css';

class App extends Component {
  state = { columns: [], filePath: '', rows: [] }
  
  componentDidMount() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);

    generateMenu(this);
  }

  startPiplSearch = async e => {
    const { rows } = this.state;
    const propertyDictionary = {
      "First Name": "names",
      "Last Name": "names",
      "Email1": "emails",
      "Email2": "emails",
      "Phone1": "phones",
      "Phone2": "phones",
      "Mailing Address": "addresses"
    }

    const updatedRows = await rows.map(async row => {
      const person = {
        names: [],
        emails: [],
        phones: []
      }

      const nameObject = {};

      if (row["First Name"]) {
        nameObject.first = row["First Name"];
      }

      if (row["Last Name"]) {
        nameObject.last = row["Last Name"];
      }

      person.names.push(nameObject);

      for (let key in row) {
        if (key !== "First Name" && key !== "Last Name" && key !== "Mailing Address" && key !== "id") {
          if (row[key]) {
            const arrayProperty = propertyDictionary[key];
            person[arrayProperty].push(row[key]);
          }
        }
      }

      if (row["Mailing Address"]) {
        person.addresses = [];
        person.addresses.push({ raw: row["Mailing Address"] });
      }

      const requestObject = { person: JSON.stringify(person), key: window.process.env.PIPL_API_KEY };
      const queryString = qs.stringify(requestObject);
      const newRow = await this.getNewRow(queryString);
      return Object.assign(row, newRow);
    });

    Promise.all(updatedRows)
      .then(rows => this.setState({ rows }));
  }

  getNewRow = async () => {
    return await fetch('/temp/person.json')
      .then(response => response.json())
      .then(json => {
        const possiblePerson = json.possible_persons[0];
        const row = {
          "First Name": possiblePerson.names[0].first,
          "Last Name": possiblePerson.names[0].last,
          "Email1": (possiblePerson.emails || [])[0] ? possiblePerson.emails[0].address : "",
          "Email2": (possiblePerson.emails || [])[1] ? possiblePerson.emails[1].address : "",
          "Phone1": possiblePerson.phones[0] ? possiblePerson.phones[0].display : "",
          "Phone2": possiblePerson.phones[1] ? possiblePerson.phones[1].display : "",
          "Mailing Address": possiblePerson.addresses[0] ? possiblePerson.addresses[0].display : "",
        }
        return row;
      });
  }

  render() {
    return (
      <div className="app">
        <div className="ribbon">
          <div>{this.state.filePath}</div>
          <div><button onClick={this.startPiplSearch}>Start Pipl Search</button></div>
        </div>
        <ReactDataGrid
          columns={this.state.columns}
          minHeight={window.visualViewport.height}
          rowGetter={i => this.state.rows[i]}
          rowsCount={this.state.rows.length}
          enableCellSelect={false}
        />
      </div>
    );
  }
}

export default App;
