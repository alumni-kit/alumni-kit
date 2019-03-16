import React from "react";
import { Button, Input, Modal } from "semantic-ui-react";

const ApiKeyModal = ({ openApiKeyModal, piplApiKey, updatePiplApiKey, savePiplApiKey }) => (
  <Modal id="api-key-modal" closeIcon open={openApiKeyModal} size="tiny">
    <Modal.Header>ENTER YOUR API KEY</Modal.Header>
    <Modal.Content className="api-key-modal__content">
      <Input
        className="api-key-modal__input"
        onChange={updatePiplApiKey}
        placeholder="Insert API key"
        value={piplApiKey}
      />
    </Modal.Content>
    <Modal.Actions>
      <Button color="yellow" onClick={savePiplApiKey}>Save & Continue</Button>
    </Modal.Actions>
  </Modal>
);

export default ApiKeyModal;