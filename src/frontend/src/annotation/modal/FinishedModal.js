import { Modal } from 'react-bootstrap';


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
      <p>Please watch out for new studies from us on Prolific, those with good results will be invited to participate in future studies with potential for bonuses.</p>
      </Modal.Body>
    </Modal>
  );
}

