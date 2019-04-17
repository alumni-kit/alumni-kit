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

const fs = window.require("fs");

class App extends Component {
  state = {
    columns: [],
    fileName: '',
    filePath: '',
    openApiKeyModal: false,
    openConfirmModal: false,
    openCompletionModal: false,
    openEarlyExitModal: false,
    openPossibleMatchesModal: false,
    openProgressModal: false,
    openReviewModal: false,
    openSearchRemainingRowsModal: false,
    piplApiKey: window.process.env.PIPL_API_KEY,
    rows: [],
    selectedRow: {},
    selectedSearchPointer: '',
    totalRows: [],
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

  openReviewModal = (index, row, header) => {
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
          if (row.Status.status === "Complete") {
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
      fileName,
      filePath,
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
        <ApiKeyModal
          closeApiKeyModal={this.closeApiKeyModal}
          openApiKeyModal={openApiKeyModal}
          piplApiKey={piplApiKey}
          validatePiplApiKey={this.validatePiplApiKey}
          validPiplApiKey={validPiplApiKey}
          updatePiplApiKey={this.updatePiplApiKey}
        />
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
