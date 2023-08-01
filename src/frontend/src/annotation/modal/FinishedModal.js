import { Modal } from 'react-bootstrap';

// SHOWN TO USERS AFTER THEIR SUBMISSION IS REGISTERED AS COMPLETED IN THE DATABASE, "LOCK OUT"
export default function FinishedModal({ show }) {

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      size="lg"
      fullscreen
    >
      <Modal.Header>
        <Modal.Title>Thank you for your contribution!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Put this code in toloka: 63241816453</p>
      </Modal.Body>
    </Modal>
  );
}

