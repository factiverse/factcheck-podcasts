import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { finalModalData } from '../help/help';

export default function FinalizeModal({ show, handleClose, agentSession, setAgentSession, agentSessionUpdated, setAgentSessionUpdated }) {

  const [feedback, setFeedback] = useState(''); // create a state for the feedback

  const completionCode = "C18BT6R7";
  const externalLink = "https://app.prolific.co/submissions/complete?cc=" + completionCode;

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value); // update the feedback state
  };

  const handleFinish = (e) => {
    if (feedback) { // check if there is feedback
      setAgentSession({
          ...agentSession,
          survey: {
              ...agentSession.survey,
              feedback // add the feedback to the survey
          },
          finished: true
      });
    } else {
      setAgentSession({
          ...agentSession,
          finished: true
      });
    }
    setAgentSessionUpdated(!agentSessionUpdated);
  };

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
        <Form.Group>
          <Form.Label>{finalModalData.feedbackTitle}</Form.Label>
          <Form.Control as="textarea" rows={3} onChange={handleFeedbackChange}/>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <a href={externalLink} target='blank'>
          <Button variant="primary" onClick={handleFinish}>Submit</Button>
        </a>
      </Modal.Footer>
    </Modal>
  );
}
