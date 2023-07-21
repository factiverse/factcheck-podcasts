import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Tabs, Tab, Image } from 'react-bootstrap';
import { helpModalData } from '../help/help';
import { allQualifiers } from '../data';
import DOMPurify from 'dompurify';
import { secondsToHms } from '../../util/time';

export default function WelcomeModal({ show, handleClose, segmentation, agentSession, setAgentSession, agentSessionUpdated, setAgentSessionUpdated }) {
  const [qualifiers, setQualifiers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [helpData, setHelpData] = useState(null);

  // if segmentation.name contains the string "Factiverse", then set the help data to helpModalData.FV_CW
  // otherwise, if segmentation.name contains  "ProlificP" then set the help data to helpModalData.old
  // otherwise, if segmentation.name contains  "Pv3" then set the help data to helpModalData.new
  useEffect(() => {
    if (segmentation.name.includes("Factiverse")) {
      setHelpData(helpModalData.FV_CW);
    } else if (segmentation.name.includes("ProlificP")) {
      setHelpData(helpModalData.original);
    } else if (segmentation.name.includes("Pv3")) {
      setHelpData(helpModalData.new);
    }
  }, [segmentation]);



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

  }, [segmentation, qualifiers]);

  // set the intial value of the political survey question to the value in the agentSession
  useEffect(() => {
    setSelectedValue(agentSession?.survey?.political || null);
  }, [agentSession]);


  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleOkay = () => {
    setAgentSession({
      ...agentSession,
      survey: { political: selectedValue },
    });
    setAgentSessionUpdated(!agentSessionUpdated);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
      fullscreen={"xl-down"}
    >
      <Modal.Header closeButton={selectedValue ?? null}>
        <Modal.Title>{helpData?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="introduction" id="uncontrolled-tab-example">
          <Tab eventKey="introduction" title="Introduction">
            <p dangerouslySetInnerHTML={{ __html: helpData?.introduction }} className='pt-2 mb-1'></p>
            <p><em>ASSIGNED PODCAST:</em><br />
              <strong>Podcast Name :</strong> {segmentation.channel.title}<br />
              <strong>Episode Name :</strong> {segmentation.item.title}<br />
              <strong>Full Audio Length :</strong> {secondsToHms(segmentation.item.audio_length)}<br />
              Additional details about the podcast are included on this help window, go to the <strong>Podcast Details</strong> tab above.
            </p>


            <h5>{helpData?.workflowTitle}</h5>
            <p dangerouslySetInnerHTML={{ __html: helpData?.workflowIntroduction }}></p>
            { false &&
            <>
            <h5>The following task cards will appear on at least one statement:</h5>
            <ul>
              {qualifiers.includes("Checkworthiness") ? <li dangerouslySetInnerHTML={{ __html: helpData?.workflowDescriptionCheckable }}></li> : null}
              {qualifiers.includes("Factcheck") ? <li dangerouslySetInnerHTML={{ __html: helpData?.workflowDescriptionFactcheck }}></li> : null}
              {qualifiers.includes("ClaimSpan") ? <li dangerouslySetInnerHTML={{ __html: helpData?.workflowDescriptionClaimSpan }}></li> : null}
              {qualifiers.includes("Motivation") ? <li dangerouslySetInnerHTML={{ __html: helpData?.workflowDescriptionMotivation }}></li> : null}
              {qualifiers.includes("Transcription") ? <li dangerouslySetInnerHTML={{ __html: helpData?.workflowDescriptionTranscribe }}></li> : null}
              {qualifiers.includes("Advertising") ? <li dangerouslySetInnerHTML={{ __html: helpData?.workflowDescriptionAdvertising }}></li> : null}
              {qualifiers.includes("Diarization") ? <li dangerouslySetInnerHTML={{ __html: helpData?.workflowDescriptionDiarization }}></li> : null}
            </ul>
            <p><strong>Remember you are required to click the <strong className='me-1' style={{fontSize: '0.8rem', backgroundColor:'blue', color:'white', display:'inline-flex', justifyContent:'center', alignItems:'center', borderRadius:'5px',}}>&nbsp;&nbsp;?&nbsp;&nbsp;</strong>
              button on the top right of the task cards before completing that task for the first time.</strong></p>
              </>
              }
            {/* POLITICS */}

            {segmentation.channel.study_category === "politics" && !segmentation.name.includes("Factiverse") && agentSession && (qualifiers.includes("Checkworthiness") || qualifiers.includes("Factcheck")) ?
              <>
                <h5>{helpData?.politicalTitle}</h5>
                <p dangerouslySetInnerHTML={{ __html: helpData?.politicalBody }}></p>
                <Form>
                  <div key={`inline-radio`} className="mb-3 d-flex justify-content-center">
                    <Form.Check
                      inline
                      name='politicalLean'
                      label="Very Liberal"
                      type="radio"
                      id={`inline-radio-1`}
                      value="Very Liberal"
                      checked={selectedValue === "Very Liberal"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      name='politicalLean'
                      label="Moderate Liberal"
                      type="radio"
                      id={`inline-radio-2`}
                      value="Moderate Liberal"
                      checked={selectedValue === "Moderate Liberal"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      name='politicalLean'
                      label="Neutral / Independent"
                      type="radio"
                      id={`inline-radio-3`}
                      value="Neutral / Independent"
                      checked={selectedValue === "Neutral / Independent"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      name='politicalLean'
                      label="Moderate Conservative"
                      type="radio"
                      id={`inline-radio-4`}
                      value="Moderate Conservative"
                      checked={selectedValue === "Moderate Conservative"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      name='politicalLean'
                      label="Very Conservative"
                      type="radio"
                      id={`inline-radio-5`}
                      value="Very Conservative"
                      checked={selectedValue === "Very Conservative"}
                      onChange={handleChange}
                    />
                  </div>
                </Form>
              </>
              : null}

            {segmentation.channel.study_category === "health" ?
              <>
                <h5>{helpData?.healthTitle}</h5>
                <p dangerouslySetInnerHTML={{ __html: helpData?.healthBody }}></p>
              </>
              : null}

            <h5>{helpData?.closingTitle}</h5>
            <p dangerouslySetInnerHTML={{ __html: helpData?.closingBody }}></p>
          </Tab>
          <Tab eventKey="podcastInfo" title="Podcast Details">

            <h4 className='pt-2'>Podcast Details</h4>
            <p><strong>Podcast Name :</strong> {segmentation.channel.title}</p>
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize("<strong>Podcast Description :</strong> " + segmentation.channel.description) }} />
            {segmentation.channel.summary !== segmentation.channel.description ?
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize("<strong>Podcast Summary :</strong> " + segmentation.channel.summary) }} /> : null
            }

            <p><strong>Podcast Categories :</strong> {segmentation.channel.categories}</p>

            <p><strong>Episode Name :</strong> {segmentation.item.title}</p>
            {segmentation.item.description && <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize("<strong>Episode Description :</strong> " + segmentation.item.description) }} />}
            {segmentation.item.summary !== segmentation.item.description ?
              <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize("<strong>Episode Summary :</strong> " + segmentation.item.summary) }} /> : null
            }
            <p><strong>Episode Link :</strong> <a href={segmentation.item.link} target='_blank' rel='noopener noreferrer'>{segmentation.item.link}</a></p>
            <Image src={segmentation.channel.image} fluid style={{ width: '25rem' }}></Image>
          </Tab>

        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOkay} disabled={!(selectedValue || segmentation.channel.study_category !== "politics" || (!qualifiers.includes("Checkworthiness") || !qualifiers.includes("Factcheck")))}>
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
