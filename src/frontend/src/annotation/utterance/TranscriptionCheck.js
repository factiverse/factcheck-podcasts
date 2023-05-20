import React, { useState, useEffect, useRef } from 'react';
import { ToggleButton, ButtonGroup, Form, Card } from 'react-bootstrap';
import HelpPopUp from '../help/HelpPopUp';
import HelpTooltipButton from '../help/HelpTooltipButton';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { helpPopUpData } from '../help/help';
import CircleFirstLetter from '../help/CircleFirstLetter';
import '../annotation.css';

const radios = [
  { name: 'Approve Original', value: 1, help: "Approve the machine transcription as correct. (keyboard 'a')" },
  { name: 'Edit', value: 2, help: "Unlock the text box and make corrections to the transcription. (keyboard 'e')" },
  { name: 'Confirm Edit', value: 3, help: "Confirm your edits to the machine transcription. (keyboard 'c')" },
  { name: 'Unsure', value: 4, help: "I cannot determine if this transcription is correct. For example unclear audio or foreign language." },
  { name: 'Reset', value: 5, help: "Delete your edits and restore original." },
];

// map the radios into an object where the name is the key and the value is the value
const radioDict = radios.reduce((acc, cur) => {
  acc[cur.name] = cur.value;
  return acc;
}, {});

export default function TranscriptionCheck({ qualifier, agent, classification, utterance, postToAPI, transcriptionInputRef, isExpedited }) {
  const [radioValue, setRadioValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const buttonRefs = useRef([])

  // if isExpedited is true, and no classification exists, then just post "Approve Original" to the API
  useEffect(() => {
    if (isExpedited && !classification) {
      console.log("NO CLASSIFICATION")
      postToAPI(utterance.uuid, qualifier, "Approve Original", '', agent);
    }
  }, [isExpedited, classification]);

  useEffect(() => {
    setRadioValue(classification?.category && classification.category.length > 0 ? radioDict[classification.category] : '');
    setTextValue(classification?.label ? classification.label : utterance.text);

  }, [utterance, classification]);

  useEffect(() => {
    if (radioValue === 2) {
      transcriptionInputRef.current.focus();
    } else {
      const selectedIndex = radios.findIndex((radio) => radio.value === radioValue);
      if (selectedIndex !== -1 && buttonRefs.current[selectedIndex]) {
        buttonRefs.current[selectedIndex].focus();
      }
    }
  }, [radioValue]);


  return (
    <Card>
      <Card.Header className='pb-0'>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Card.Title>{helpPopUpData[qualifier].cardTitle}</Card.Title>
          <div className='pb-2'>
            {radioValue === 1 || radioValue === 3 || radioValue === 4 ? (
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
            <span dangerouslySetInnerHTML={{ __html: helpPopUpData[qualifier].cardInstructionBody }} />
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
              ref={transcriptionInputRef}
              disabled={radioValue !== 2}
              onChange={(e) => setTextValue(e.target.value)}
              onBlur={
                (e) => {

                  if (radioValue === 2) { // edit with no approve
                    postToAPI(
                      utterance.uuid,
                      qualifier,
                      radios.filter((item) => item.value === radioValue).shift().name,
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
                      variant='outline-secondary'
                      className='p-1 ifc-button'
                      name={`${qualifier}-button`}
                      value={radio.value}
                      checked={radioValue === radio.value}
                      ref={(el) => (buttonRefs.current[k] = el)}
                      onChange={
                        (e) => {
                          console.log(e.currentTarget.value)
                          // react suggests changing this to 3 equals === / !==, but it doesn't work
                          if (e.currentTarget.value == 1) { // approve original
                            setTextValue(utterance.text);
                            postToAPI(utterance.uuid, qualifier, radio.name, '', agent);
                          } else if (e.currentTarget.value == 2) { // edit
                            postToAPI(utterance.uuid, qualifier, radio.name, textValue, agent);
                            transcriptionInputRef.current.focus();
                          } else if (e.currentTarget.value == 3) { // approve edit
                            if (textValue.length > 0 && textValue != utterance.text) {
                              postToAPI(utterance.uuid, qualifier, radio.name, textValue, agent);
                            } else {
                              alert("First click EDIT to enable editing in the text box, the CONFIRM EDIT button will \
only work after changes have been made to the text in EDIT mode.")
                            }
                          } else if (e.currentTarget.value == 4) { // unsure
                            setTextValue(utterance.text);
                            postToAPI(utterance.uuid, qualifier, radio.name, '', agent);
                          } else if (e.currentTarget.value == 5) { // reset
                            setTextValue(utterance.text);
                            postToAPI(utterance.uuid, qualifier, '', '', agent);
                          }
                        }
                      }
                    >
                      <strong>{radio.name !== "Reset" ? <CircleFirstLetter text={radio.name} /> : radio.name}</strong>
                    </ToggleButton>}
                  key={`help-box-${k}`}
                />
              ))}
            </ButtonGroup >
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}
