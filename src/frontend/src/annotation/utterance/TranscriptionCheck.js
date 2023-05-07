import React, { useState, useEffect, useRef } from 'react';
import { ToggleButton, ButtonGroup, Form, Card } from 'react-bootstrap';
import axios from "axios";
import HelpPopUp from '../help/HelpPopUp';
import HelpTooltipButton from '../help/HelpTooltipButton';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { helpPopUpData } from '../help/help';

const radios = [
  { name: 'Approve Original', value: 1, help: "Confirm the original transcription is correct." },
  { name: 'Edit', value: 2, help: "Unlock the text box and make corrections to the original transcription." },
  { name: 'Approve Edit', value: 3, help: "Confirm your edits to the original transcription." },
  { name: 'Reset', value: 4, help: "Delete your edits and restore original." },
];

// map the radios into an object where the name is the key and the value is the value
const radioDict = radios.reduce((acc, cur) => {
  acc[cur.name] = cur.value;
  return acc;
}, {});


export default function TranscriptionCheck({ qualifier, agent, classification, utterance, setUtterance }) {
  const [radioValue, setRadioValue] = useState(
    classification?.category && classification.category.length > 0 ? radioDict[classification.category] : ''
  );
  const [textValue, setTextValue] = useState('');
  const inputRef = useRef(null);

  const postToAPI = (utt_uuid, qualifier, category, label, agent) => {
    axios.post('/api/classifications/' + utt_uuid + "/", {
      utterance: utt_uuid,
      qualifier,
      category,
      label,
      agent,
    })
      .then((response) => {
        // update the classifications list in the utterance with the new classification received back from the API
        var newClassificationSet = [...utterance.classification_set];
        const classificationIndex = newClassificationSet.findIndex((item) => item.qualifier === qualifier);
        if (classificationIndex !== -1) {
          newClassificationSet[classificationIndex] = response.data;
        } else {
          newClassificationSet.push(response.data);
        }
        setUtterance({ ...utterance, classification_set: newClassificationSet });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  useEffect(() => {
    setRadioValue(classification?.category && classification.category.length > 0 ? radioDict[classification.category] : '');
    setTextValue(classification?.label ? classification.label : utterance.text);
  }, [utterance, classification]);


  return (
    <Card className='mt-3 mb-3'>
      <Card.Header className='pb-0'>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Card.Title>{helpPopUpData[qualifier].cardTitle}</Card.Title>
          <div className='pb-2'>
            {radioValue === 1 || radioValue === 3 ? (
              <span style={{ color: 'green', marginRight: '5px' }}>
                <FaCheck />
              </span>
            ) : (
              <span style={{ color: 'red', marginRight: '5px' }}>
                <FaTimes />
              </span>
            )}
            <HelpPopUp
              header={helpPopUpData[qualifier].helpHeader}
              text={helpPopUpData[qualifier].helpText}
              qualifier={qualifier} />
          </div>
        </div>
      </Card.Header>



      <Card.Body className='pb-0'>

      <Card.Title>{helpPopUpData[qualifier].cardInstructionHeader}</Card.Title>
        {helpPopUpData[qualifier].cardInstructionBody &&
          <Card.Text>
            {helpPopUpData[qualifier].cardInstructionBody}
          </Card.Text>
        }
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">

            <Form.Control
              as="textarea"
              aria-label="With textarea"
              style={{ height: textValue?.length > 150 ? (textValue.length / 1.5) + 'px' : '75px' }}
              value={textValue}
              className='form-control mb-2 overflow-visible'
              ref={inputRef}
              disabled={radioValue != 2}
              onChange={(e) => setTextValue(e.target.value)}
              onBlur={
                (e) => {
                  if (radioValue == 2) { // edit with no approve
                    postToAPI(
                      utterance.uuid,
                      qualifier,
                      radios.filter((item) => item.value == radioValue).shift().name,
                      e.currentTarget.value,
                      agent
                    );
                  }
                }
              }
            />

            <ButtonGroup>
              {radios.map((radio, k) => (
                <HelpTooltipButton
                  label={radio}
                  button={
                    <ToggleButton
                      key={`${qualifier}-button-${k}`}
                      id={`${qualifier}-button-${k}`}
                      type="radio"
                      variant='outline-success'
                      className='text-nowrap'
                      name={`${qualifier}-button`}
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={
                        (e) => {
                          if (e.currentTarget.value == 1) { // approve original
                            setTextValue(utterance.text);
                            postToAPI(utterance.uuid, qualifier, radio.name, '', agent);
                          } else if (e.currentTarget.value == 2) { // edit
                            postToAPI(utterance.uuid, qualifier, radio.name, textValue, agent);
                          } else if (e.currentTarget.value == 3) { // approve edit
                            if (textValue.length > 0 && textValue != utterance.text) {
                              postToAPI(utterance.uuid, qualifier, radio.name, textValue, agent);
                            } else {
                              alert("First click EDIT to enable editing in the text box, the APPROVE EDIT button will \
only work after changes have been made to the text in EDIT mode.")
                            }
                          } else if (e.currentTarget.value == 4) { // reset
                            setTextValue(utterance.text);
                            postToAPI(utterance.uuid, qualifier, '', '', agent);
                          }
                        }
                      }
                    >
                      {radio.name}
                    </ToggleButton>}
                  key={`help-box-${k}`} />
              ))}
            </ButtonGroup >
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}
