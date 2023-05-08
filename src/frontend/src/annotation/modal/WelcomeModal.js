import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { helpModalData } from '../help/help';
import { allQualifiers } from '../data';


export default function WelcomeModal({ show, handleClose, segmentation }) {
  const [qualifiers, setQualifiers] = useState([]);

  // loop through the segmentation utterance set, if any utterances have visibility=1,
  // then set the qualifiers to allQualifiers, otherwise loop through the utterances and
  // add the qualifiers in each utterance.visibility array to the qualifiers state which is a set
  useEffect(() => {
    for (let i = 0; i < segmentation.utterance_set.length; i++) {
      if (segmentation.utterance_set[i].visibility === 1) {
        setQualifiers(allQualifiers);
        break;
      } else {
        for (let j = 0; j < segmentation.utterance_set[i].visibility.length; j++) {
          // if the qualifiers array doesn't already contain the qualifier, add it
          if (!qualifiers.includes(segmentation.utterance_set[i].visibility[j])) {
            setQualifiers([...qualifiers, segmentation.utterance_set[i].visibility[j]]);
          }
          
        }
      }
    }

  }, [segmentation]);

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
        <Modal.Title>{helpModalData.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p dangerouslySetInnerHTML={{ __html: helpModalData.introduction }}></p>
        <p>Your work will focus on one episode of a podcast, the assigned podcast for this study is:<br />
          <strong>Podcast Name :</strong> {segmentation.channel.title}<br />
          <strong>Episode Name :</strong> {segmentation.item.title}
        </p>


        <h5>{helpModalData.workflowTitle}</h5>
        <p dangerouslySetInnerHTML={{__html: helpModalData.workflowIntroduction}}></p>
        <ul>
          {qualifiers.includes("Checkworthiness") ? <li dangerouslySetInnerHTML={{ __html: helpModalData.workflowDescriptionCheckworthy }}></li> : null}
          {qualifiers.includes("Factcheck") ? <li dangerouslySetInnerHTML={{ __html: helpModalData.workflowDescriptionFactcheck }}></li> : null}
          {qualifiers.includes("ClaimSpan") ? <li dangerouslySetInnerHTML={{ __html: helpModalData.workflowDescriptionClaimSpan }}></li> : null}
          {qualifiers.includes("Motivation") ? <li dangerouslySetInnerHTML={{ __html: helpModalData.workflowDescriptionMotivation }}></li> : null}
          {qualifiers.includes("Transcription") ? <li dangerouslySetInnerHTML={{ __html: helpModalData.workflowDescriptionTranscribe }}></li> : null}
          {qualifiers.includes("Advertising") ? <li dangerouslySetInnerHTML={{ __html: helpModalData.workflowDescriptionAdvertising }}></li> : null}
        </ul>
        {/* POLITICS */}

        <h5>{helpModalData.politicalTitle}</h5>
        <p dangerouslySetInnerHTML={{__html: helpModalData.politicalBody}}></p>
        
        <h5>{helpModalData.healthTitle}</h5>
        <p dangerouslySetInnerHTML={{__html: helpModalData.healthBody}}></p>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
