import React, { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import axios from "axios";
import TextareaAutosize from 'react-textarea-autosize';
import HelpPopUp from './HelpPopUp';

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
  { name: 'Approve Original', value: 1 },
  { name: 'Edit', value: 2 },
  { name: 'Approve Edit', value: 3 },
  { name: 'Reset', value: 4 },
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
            header={"test"}
            text={"test"}
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
                </ToggleButton>
              ))}
            </ButtonGroup >
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}
