import React from 'react';
import { Modal, Button } from 'react-bootstrap';


export default function WelcomeModal({ show, handleClose, segmentation }) {


  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Welcome to this Podcast Annotation Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please take a moment to read through these instructions and guidlines which will help you complete the tasks
          and ensure your work is accepted. You may refer back to this window at any time by clicking the green 
          <em> HELP</em> button in the top right corner of the screen.
        </p>
        <p>Your work will focus on one episode of a podcast, the assigned podcast for this study is:<br/>
          <strong>Podcast Name :</strong> {segmentation.channel.title}<br/>
          <strong>Episode Name :</strong> {segmentation.item.title}
        </p>
        
        <h5>What is your task?</h5>
        You will be presented with a limited selection of statements from this podcast, and for each statement you will have some tasks to complete.
        Audio from the podcast is available on the integrated media player, and you can use this to listen to the podcast and check the context of the statement.
        {/* POLITICS */}


        {/* POLITICS */}
        <h5>Is this political?</h5>
        <p>The podcast content you will be labelling and listening to will often be of a political nature, but the creators of this study are politically neutral. 
          For researchers to build accurate and non-biased AI systems, it is essential to have the input of people with a wide range of views. Whether you agree with
          the views expressed in this podcast or not, your work here is equally valuable. The key factor is that you remain critical and objective in your labelling.
          You are free to formulate your own search queries, on your chosen platform, and prioritize evidence documents from sources that you find most trustworthy, but 
          all judgements as to whether the evidence refutes or supports the claim must be based on the content of the evidence document as it expresses the facts.

        </p>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

