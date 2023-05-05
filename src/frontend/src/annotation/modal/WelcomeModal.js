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
      fullscreen={"xl-down"}
    >
      <Modal.Header closeButton>
        <Modal.Title>Welcome to this Podcast Annotation Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please take a moment to read through these instructions and guidlines which will help you complete the tasks
          and ensure your work is accepted. You may refer back to this window at any time by clicking the green 
          <strong> HELP</strong> button in the top left corner of the window.
        </p>
        <p>Your work will focus on one episode of a podcast, the assigned podcast for this study is:<br/>
          <strong>Podcast Name :</strong> {segmentation.channel.title}<br/>
          <strong>Episode Name :</strong> {segmentation.item.title}
        </p>
        
        <h5>What is your task?</h5>
        <p>You will be presented with a series of statements from this podcast, and for each statement you will have some tasks to complete.

        </p>
        <ul>
            <li>First, you will be asked to determine whether or not the statement is <strong>checkworthy</strong> ØÆÅØÆØÆÅØÆÅØØÅÅÅØØØÆPÅ.</li>
            <li>If you mark the statement as <strong>checkworthy</strong> you will undertake a basic fact check of the statement on the internet.
            You will make a search on a platform of your choice, recording the query you used, then select several document provided by the query
             and make a judgement whether these documents support the query or not</li>
            <li>Finally, you will be asked to <strong>summarize</strong> the evidence you have selected.</li>
          </ul>
        You will be presented with a limited selection of statements from this podcast, and for each statement you will have some tasks to complete.
        Audio from the podcast is available on the integrated media player, and you can use this to listen to the podcast and check the context of the statement.
        {/* POLITICS */}


        {/* POLITICS */}
        <h5>Is this political?</h5>
        <p>The podcast content you will be labelling and listening to will often be of a political nature, but the creators of this study are politically neutral. 
          For researchers to build accurate and non-biased AI systems, it is essential to have the input of people with a wide range of views. Whether you agree with
          the views expressed in this podcast or not, your work here is equally valuable. The key factor is that you remain critical and objective in your labelling.
          You are free to formulate your own search queries, on your chosen platform, and prioritize evidence documents from sources that you find most trustworthy, but 
          all judgements as to whether the evidence refutes or supports the claim must be based on the content of the evidence document as it presents the facts.

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

