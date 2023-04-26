import React, { useState, useEffect, useRef } from 'react';
import { ToggleButton, ButtonGroup, Form, Card } from 'react-bootstrap';
import axios from "axios";
import HelpPopUp from './HelpPopUp';
import HelpTooltipButton from './HelpTooltipButton';

const postToAPI = (utterance, qualifier, category, label, agent) => {
  axios.post('/api/classifications/' + utterance + "/", {
    utterance,
    qualifier,
    category,
    label,
    agent,
  })
    .then((response) => {
      // do nothing
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
};

const radios = [
  { name: 'Approve Original', value: 1, help: "Confirm the original transcription is correct." },
  { name: 'Edit', value: 2, help: "Unlock the text box and make corrections to the original transcription." },
  { name: 'Approve Edit', value: 3, help: "Confirm your edits to the original transcription." },
  { name: 'Reset', value: 4, help: "Delete your edits and restore original." },
];

export default function TranscriptionCheck({ qualifier, classification, agent, utterance }) {
  const [radioValue, setRadioValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setRadioValue(classification ? radios.filter((item) => item.name === classification.category)[0].value : '');
    setTextValue(classification?.label || utterance.text);
  }, [utterance, classification]);

  return (
    <Card className='mt-3 mb-3'>
      <Card.Header>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Card.Title>Transcription</Card.Title>
          <HelpPopUp
            header={"Transcription Verification"}
            text={"Verify the accuracy of the transcription. FOCUS ON CORRECTING WORDS THAT ARE CLEARLY WRONG after listening to the audio. This is a non-verbatim transcription, so filler words such as \"um,\" \"uh,\" \"like,\" \"so,\" and \"you know.\", repeated words, stutters, and false starts are often left out, DO NOT ADD THESE., click \"Edit\" to make changes followed by \"Approve Edit\" to confirm them, \"Rest\" deletes your previous input."
            }
            qualifier={"transcription"} />
        </div>
      </Card.Header>

      <Card.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              as="textarea"
              aria-label="With textarea"
              style={{ height: textValue.length > 150 ? (textValue.length / 1.5) + 'px' : '75px' }}
              value={textValue}
              className='form-control mb-2 overflow-visible'
              ref={inputRef}
              disabled={radioValue != 2}
              onChange={(e) => setTextValue(e.target.value)}
              onBlur={
                (e) => {
                  if (radioValue == 2) { // edit with no approve
                    postToAPI(utterance.uuid, qualifier, radios.filter((item) => item.value == radioValue).shift().name, e.currentTarget.value, agent);
                  }
                }
              }
            />

            <ButtonGroup>
              {radios.map((radio, k) => (
                <HelpTooltipButton
                  text={radio.help}
                  button={
                    <ToggleButton
                      key={`transcript-button-${k}`}
                      id={`transcript-button-${k}`}
                      type="radio"
                      variant='outline-success'
                      className='text-nowrap'
                      name={`transcript-button`}
                      value={radio.value}
                      checked={radioValue == radio.value}
                      onChange={
                        (e) => {
                          var val = e.currentTarget.value;
                          if (val == 1) { // approve original
                            setTextValue(utterance.text);
                            setRadioValue(val);
                            postToAPI(utterance.uuid, qualifier, radio.name, '', agent);
                          } else if (val == 2 || val == 3) { // edit
                            setRadioValue(val);
                            if (inputRef.current.value != utterance.text) {
                              postToAPI(utterance.uuid, qualifier, radio.name, inputRef.current.value, agent);
                            }
                          } else if (val == 4) { // reset
                            setTextValue(utterance.text);
                            setRadioValue('');
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
