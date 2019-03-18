import React from "react";
import { Button, Input, Message, Modal } from "semantic-ui-react";

const ApiKeyModal = ({
  closeApiKeyModal,
  openApiKeyModal,
  piplApiKey,
  updatePiplApiKey,
  validatePiplApiKey,
  validPiplApiKey
}) => (
    <Modal
      id="api-key-modal"
      closeIcon
      onClose={closeApiKeyModal}
      open={openApiKeyModal}
      size="tiny"
    >
      <Modal.Header>ENTER YOUR API KEY</Modal.Header>
        <Modal.Content id="api-key-modal__content">
          <Input
            className="api-key-modal__input"
            error={!validPiplApiKey}
            onChange={updatePiplApiKey}
            placeholder="Insert API Key"
            value={piplApiKey}
          />
          <Message
            className="api-key-modal__message"
            hidden={validPiplApiKey}
            negative
          >
            Enter Pipl API Key
          </Message>
        </Modal.Content>
        <Modal.Actions>
          <Button color="yellow" onClick={validatePiplApiKey}>Save & Continue</Button>
        </Modal.Actions>
    </Modal>
);

export default ApiKeyModal;