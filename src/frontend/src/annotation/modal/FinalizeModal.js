import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { finalModalData } from '../help/help';


export default function FinalizeModal({ show, handleClose }) {

  const completionCode = "I2PWSFRG";
  const externalLink = "https://app.prolific.co/submissions/complete?cc=" + completionCode;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>{finalModalData.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {finalModalData.body.map(
          (paragraph, index) => <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }}></p>
        )}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <a href={externalLink}>
          <Button variant="primary">Submit</Button>
        </a>
      </Modal.Footer>
    </Modal>
  );
}

