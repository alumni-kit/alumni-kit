import React, { Component } from "react";
import ReactDataGrid from "react-data-grid";
import { ToastContainer, toast } from "react-toastify";
import { Button, Header, Segment } from "semantic-ui-react";
import qs from "qs";
import generateMenu from "./util/generateMenu";
import Dropzone from "./components/Dropzone/Dropzone";
import ApiKeyModal from "./components/ApiKeyModal/ApiKeyModal";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const fs = window.require("fs");

class App extends Component {
  state = {
    columns: [],
    filePath: '',
    openApiKeyModal: false,
    piplApiKey: window.process.env.PIPL_API_KEY,
    rows: [],
    validPiplApiKey: true,
  }
  
  componentDidMount() {
    const PIPL_API_KEY = window.process.env.PIPL_API_KEY;

    if (PIPL_API_KEY === "" || typeof PIPL_API_KEY === undefined) {
      this.openApiKeyModal(PIPL_API_KEY);
    }

    generateMenu(this);
  }

  closeApiKeyModal = () => {
    this.setState({ openApiKeyModal: false, validPiplApiKey: true });
  }

  openApiKeyModal = (piplApiKey) => {
    this.setState({ openApiKeyModal: true, piplApiKey });
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
      .then(rows => {
        this.setState({ rows });
        window.dispatchEvent(new Event('resize'));
      });
  }

  getNewRow = async () => {
    return await fetch('/temp/person.json')
      .then(response => response.json())
      .then(async json => {
        const possiblePerson = json.possible_persons[0];
        const row = {
          "First Name": possiblePerson.names[0].first,
          "Last Name": possiblePerson.names[0].last,
          "Email1": (possiblePerson.emails || [])[0] ? possiblePerson.emails[0].address : "",
          "Email2": (possiblePerson.emails || [])[1] ? possiblePerson.emails[1].address : "",
          "Phone1": possiblePerson.phones[0] ? possiblePerson.phones[0].display : "",
          "Phone2": possiblePerson.phones[1] ? possiblePerson.phones[1].display : "",
          "Mailing Address": possiblePerson.addresses[0] ? possiblePerson.addresses[0].display : "",
          "Education": possiblePerson.educations[0] ? possiblePerson.educations[0].display : "",
          "Job": possiblePerson.jobs[0] ? possiblePerson.jobs[0].display : ""
        }

        if (!possiblePerson.emails) {
          const emailObject = await this.getEmailFromSearchPointer(row);
          return Object.assign(row, emailObject);
        } else {
          return row;
        }
      });
  }

  getEmailFromSearchPointer = async (row) => {
    return await fetch('/temp/search_pointer_response.json')
      .then(response => response.json())
      .then(json => {
        const possiblePerson = json.person;
        const emailObject = {
          "Email1": (possiblePerson.emails || [])[0] ? possiblePerson.emails[0].address : "",
          "Email2": (possiblePerson.emails || [])[1] ? possiblePerson.emails[1].address : "",
        };

        return emailObject;
      });
  };

  savePiplApiKey = () => {
    const { piplApiKey } = this.state;

    fs.writeFile(".env", `PIPL_API_KEY=${piplApiKey}`, (err) => {
      if (err) {
        throw err;
      }
      window.process.env.PIPL_API_KEY = piplApiKey;
      this.closeApiKeyModal();
      this.showToast("success", "Pipl API key is updated.");
    });
  }

  showToast = (type, message) => {
    toast[type](message);
  }

  updatePiplApiKey = e => {
    const piplApiKey = e.target.value;
    let validPiplApiKey = false;

    if (piplApiKey) {
      validPiplApiKey = true;
    }

    this.setState({ piplApiKey, validPiplApiKey });
  }

  validatePiplApiKey = () => {
    const { piplApiKey } = this.state;

    if (piplApiKey) {
      this.savePiplApiKey();
    } else {
      this.setState({ validPiplApiKey: false });
    }
  }

  render() {
    const {
      filePath,
      openApiKeyModal,
      piplApiKey,
      rows,
      validPiplApiKey
    } = this.state;

    return (
      <div className="app">
        <ToastContainer />
        <ApiKeyModal
          closeApiKeyModal={this.closeApiKeyModal}
          openApiKeyModal={openApiKeyModal}
          piplApiKey={piplApiKey}
          validatePiplApiKey={this.validatePiplApiKey}
          validPiplApiKey={validPiplApiKey}
          updatePiplApiKey={this.updatePiplApiKey}
        />
        {rows.length > 0 ? (
          <ReactDataGrid
            columns={this.state.columns}
            minHeight={window.visualViewport.height}
            rowGetter={i => this.state.rows[i]}
            rowsCount={this.state.rows.length}
            enableCellSelect={false}
            toolbar={(
              <Segment id="ribbon">
                <Header id="ribbon__filename">{filePath}</Header>
                <div><Button primary onClick={this.startPiplSearch}>Start Pipl Search</Button></div>
              </Segment>
            )}
          />
        )
        : (
          <Dropzone App={this} />
        )}
      </div>
    );
  }
}

export default App;
