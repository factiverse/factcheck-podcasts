import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


export default function UserModal({ setAgent }) {
  const [show, setShow] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  
  const handleClose = () => {
    if (loggedIn) {
      setShow(false);
    }
  };
  
  const handleSaveChanges = () => {
    if (inputValue) {
      setAgent(inputValue);
      setLoggedIn(true);
      setShow(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveChanges();
    }
  };


  return (
    <Modal show={show} onHide={handleClose} onKeyDown={handleKeyDown} tabIndex="-1">
      <Modal.Header>
        <Modal.Title>Enter a username</Modal.Title>
      </Modal.Header>

      <Modal.Body>Use the same username (caps sensitive) to restore your previous annotations</Modal.Body>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Username</Form.Label>
            <Form.Control
              placeholder="sammy_annotator"
              autoFocus
              onChange={
                (e) => {
                  setInputValue(e.target.value);
                }
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSaveChanges}
          disabled={!inputValue}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}