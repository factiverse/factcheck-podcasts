import React from 'react';
import { Modal, Button } from 'react-bootstrap';


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
        <Modal.Title>Finalize your submission and return to Prolific</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your responses have passed basic validation and you can now submit your work. </p>
        <p>Please take a moment to review your work if you have not already done so,
          click the <em>Cancel</em> button and cycle back through the statements you have already labelled
          verifying that you agree with all your answers and they follow the guidlines.</p>
        <p>By clicking submit you agree you have read and fully understood all instructions,
          and have answered all questions to the best of your ability. </p>

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

