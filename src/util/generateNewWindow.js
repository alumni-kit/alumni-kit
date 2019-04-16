const generateNewWindow = function() {
  const reactAppContext = this;
  reactAppContext.setState({
    columns: [],
    fileName: '',
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
    totalRows: [],
    validPiplApiKey: true,
  });
}

export default generateNewWindow;