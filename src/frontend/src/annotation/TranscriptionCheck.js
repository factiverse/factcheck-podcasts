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

const qualifier = 'Transcription';

export default function TranscriptionCheck({ utterance, agent }) {
  const [radioValue, setRadioValue] = useState("");
  const [textValue, setTextValue] = useState(utterance.text);
  const inputRef = useRef(null);

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/classifications/" + utterance.uuid + "/",
    }).then((response) => {
      const currentValue = response.data.filter((item) => item.qualifier === qualifier).shift();
      const radioValue = currentValue?.category ? radios.filter((item) => item.name === currentValue.category).shift().value : '';
      setRadioValue(radioValue);
      setTextValue(currentValue?.label || utterance.text);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }, [utterance, agent]);


  return (
    <Card>
      <Card.Header><Card.Title>Transcription</Card.Title>
      <HelpPopUp
                        header={"test"}
                        text={"test"}
                        qualifier={"transcription"} />
      </Card.Header>
      <Card.Body>
        <Form>
          <TextareaAutosize
            minRows={3}
            value={textValue}
            className='form-control mb-3'
            ref={inputRef}
            disabled={radioValue != 2}
            onBlur={
              (e) => {
                if (radioValue == 2) { // edit with no approve
                  postToAPI(utterance.uuid, qualifier, radios.filter((item) => item.value == radioValue).shift().name, e.currentTarget.value, agent);
                }
              }
            }
            style={{ width: '100%' }}
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
        </Form>

      </Card.Body>
    </Card>
  );
}
