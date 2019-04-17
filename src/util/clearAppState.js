const clearAppState = function() {
  const reactAppContext = this;
  reactAppContext.setState({
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
  });
}

export default clearAppState;