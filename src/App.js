import ApiKeyModal from "./components/ApiKeyModal/ApiKeyModal";
import { Button, Header, Segment } from 'semantic-ui-react';
import Dropzone from "./components/Dropzone/Dropzone";
import generateMenu from './util/generateMenu';
import CompletionModal from './components/CompletionModal/CompletionModal';
import ConfirmModal from './components/ConfirmModal/ConfirmModal';
import EarlyExitModal from './components/EarlyExitModal/EarlyExitModal';
import ProgressModal from './components/ProgressModal/ProgressModal';
import ReviewModal from './components/ReviewModal/ReviewModal';
import React, { Component } from 'react';
import ReactDataGrid from "react-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const fs = window.require("fs");

class App extends Component {
  state = {
    columns: [],
    filePath: '',
    openApiKeyModal: false,
    openConfirmModal: false,
    openCompletionModal: false,
    openEarlyExitModal: false,
    openProgressModal: false,
    openReviewModal: false,
    piplApiKey: window.process.env.PIPL_API_KEY,
    rows: [],
    selectedRow: {},
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
      openCompletionModal,
      openConfirmModal,
      openEarlyExitModal,
      openProgressModal,
      openReviewModal,
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
            headerRowHeight={35}
            minHeight={window.visualViewport.height}
            rowHeight={70}
            rowGetter={i => this.state.rows[i]}
            rowsCount={this.state.rows.length}
            enableCellSelect={false}
            toolbar={() => {
              return (
                <Segment id="ribbon">
                  <Header id="ribbon__filename">{filePath}</Header>
                  <Button id="ribbon__start-pipl-search" primary onClick={() => this.setState({ openConfirmModal: true })}>Start Pipl Search</Button>
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
      </div>
    );
  }
}

export default App;
