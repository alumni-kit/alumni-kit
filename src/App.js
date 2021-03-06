import AboutModal from "./components/AboutModal/AboutModal";
import ApiKeyModal from "./components/ApiKeyModal/ApiKeyModal";
import { Button, Header, Segment } from 'semantic-ui-react';
import Dropzone from "./components/Dropzone/Dropzone";
import generateMenu from './util/generateMenu';
import CompletionModal from './components/CompletionModal/CompletionModal';
import ConfirmModal from './components/ConfirmModal/ConfirmModal';
import EarlyExitModal from './components/EarlyExitModal/EarlyExitModal';
import PossibleMatchesModal from './components/PossibleMatchesModal/PossibleMatchesModal';
import ProgressModal from './components/ProgressModal/ProgressModal';
import ReviewModal from './components/ReviewModal/ReviewModal';
import SearchRemainingRowsModal from './components/SearchRemainingRowsModal/SearchRemainingRowsModal';
import React, { Component } from 'react';
import ReactDataGrid from "react-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const electron = window.require('electron');
const fs = window.require("fs");
const userDataPath = (electron.app || electron.remote.app).getPath('userData');

class App extends Component {
  state = {
    columns: [],
    fileName: '',
    filePath: '',
    openAboutModal: false,
    openApiKeyModal: false,
    openConfirmModal: false,
    openCompletionModal: false,
    openEarlyExitModal: false,
    openPossibleMatchesModal: false,
    openProgressModal: false,
    openReviewModal: false,
    openSearchRemainingRowsModal: false,
    piplApiKey: '',
    rows: [],
    selectedRow: {},
    selectedSearchPointer: '',
    totalRows: [],
    validPiplApiKey: true,
  }
  
  componentDidMount() {
    fs.readFile(`${userDataPath}/apiKey`, 'utf8', (err, piplApiKey) => {
      if (err) {
        fs.writeFile(`${userDataPath}/apiKey`, "", (err) => {
          if (err) {
            this.showToast("error", err.message);
            throw err;
          }

          this.openApiKeyModal("");
        });
        throw err;
      }

      this.setState({ piplApiKey });

      if (piplApiKey === "" || typeof piplApiKey === undefined) {
        this.openApiKeyModal(piplApiKey);
      }
    });

    generateMenu(this);
  }

  closeApiKeyModal = () => {
    this.setState({ openApiKeyModal: false, validPiplApiKey: true });
  }

  openAboutModal = () => {
    this.setState({ openAboutModal: true });
  }

  openApiKeyModal = (piplApiKey) => {
    this.setState({ openApiKeyModal: true, piplApiKey });
  }

  openReviewModal = (index, row, header) => {
    if (index === -1) { return; }
    this.setState({ openReviewModal: true, selectedRow: row });
  }

  openConfirmModal = () => {
    this.setState({ openConfirmModal: true, rows: this.state.totalRows });
  }

  openSearchRemainingRowsModal = () => {
    this.setState({ openSearchRemainingRowsModal: true });
  }

  openPiplModal = () => {
    let completedSearches = 0;
    let totalRowCount = this.state.totalRows.length;

    this.state.totalRows.forEach(row => {
      if (typeof row.Status === "object" && row.Status.status && row["Last Update"]) {
          if (row.Status.status === "Complete" || row.Status.status === "Partial" || row.Status.status === "Error") {
              completedSearches++;
          }
      }
    });

    if (totalRowCount - completedSearches > 0 && completedSearches > 0) {
      this.openSearchRemainingRowsModal();
    } else {
      this.openConfirmModal();
    }
  }

  savePiplApiKey = () => {
    const { piplApiKey } = this.state;

    fs.writeFile(`${userDataPath}/apiKey`, piplApiKey, (err) => {
      if (err) {
        this.showToast("error", err.message);
        throw err;
      }

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
      fileName,
      filePath,
      openAboutModal,
      openApiKeyModal,
      openCompletionModal,
      openConfirmModal,
      openEarlyExitModal,
      openPossibleMatchesModal,
      openProgressModal,
      openReviewModal,
      openSearchRemainingRowsModal,
      piplApiKey,
      totalRows,
      validPiplApiKey
    } = this.state;
    return (
      <div className="app">
        <ToastContainer />
        {totalRows.length > 0 ? (
          <ReactDataGrid
            columns={this.state.columns}
            headerRowHeight={35}
            minHeight={window.visualViewport.height}
            onRowClick={this.openReviewModal}
            rowHeight={70}
            rowGetter={i => totalRows[i]}
            rowsCount={totalRows.length}
            enableCellSelect={false}
            toolbar={() => {
              return (
                <Segment id="ribbon">
                  <Header id="ribbon__filename">{filePath || fileName}</Header>
                  <Button id="ribbon__start-pipl-search" primary onClick={this.openPiplModal}>Start Pipl Search</Button>
                </Segment>
              )
            }}
          />
        )
        : (
          <Dropzone App={this} />
        )}
        <AboutModal App={this} openAboutModal={openAboutModal} />
        <ApiKeyModal
          closeApiKeyModal={this.closeApiKeyModal}
          openApiKeyModal={openApiKeyModal}
          piplApiKey={piplApiKey}
          validatePiplApiKey={this.validatePiplApiKey}
          validPiplApiKey={validPiplApiKey}
          updatePiplApiKey={this.updatePiplApiKey}
        />
        <ConfirmModal App={this} openConfirmModal={openConfirmModal} />
        <ProgressModal App={this} openProgressModal={openProgressModal} />
        <CompletionModal App={this} openCompletionModal={openCompletionModal} />
        <EarlyExitModal App={this} openEarlyExitModal={openEarlyExitModal} />
        <ReviewModal App={this} openReviewModal={openReviewModal} />
        <SearchRemainingRowsModal App={this} openSearchRemainingRowsModal={openSearchRemainingRowsModal} />
        <PossibleMatchesModal App={this} openPossibleMatchesModal={openPossibleMatchesModal} />
      </div>
    );
  }
}

export default App;
