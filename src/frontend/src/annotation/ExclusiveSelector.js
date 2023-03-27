import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import axios from "axios";
import Card from 'react-bootstrap/Card';

const postToAPI = (utterance, qualifier, label, agent) => {
    axios.post('/api/classifications/' + utterance + "/", {
        utterance,
        qualifier,
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

const headerStyle = {
    deactivated: {
      backgroundColor: "#f8f9fa",
      color: "#6c757d",
      fontWeight: "normal",
    },
    emphasized: {
      backgroundColor: "#007bff",
      color: "#ffffff",
      fontWeight: "bold",
    },
  };

export default function ExclusiveSelector({ qualifier, agent, labels, splitField, utterance }) {
    const [radioValue, setRadioValue] = useState('');
    const [category, setCategory] = useState(''); //e.g. checkworthy vs. non-checkworthy

    // get the unique values in the splitField field of the dictionaries in the labels list
    const splitValues = [...new Set(labels.map(item => item[splitField]))];

    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/classifications/" + utterance.uuid + "/",
        }).then((response) => {
            const data = response.data;
            if (data.length > 0) {
                const currentValue = data.filter((item) => item.qualifier === qualifier).shift().label;
                console.log(currentValue);
                setRadioValue(currentValue);
                // find the 'checkworthy' value in "labels" and set the category to this value
                

                setCategory(currentValue);
            } else {
                setRadioValue("");
            }
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    }, [utterance]);

    // iterate over the unique values and create a column for each

    // get the checkworthy label corresponding to the current radio button value and use this to set
    // the style of the header using the headerStyle object
    

    return (
        <Card>
            <Card.Header>{qualifier}</Card.Header>
            <Card.Body>
                <Row>
                    {splitValues.map((splitValue) => {
                        return (
                            <Col>
                            {console.log(splitValue, category)}
                            <Card.Title style={splitValue === category ? headerStyle.deactivated : headerStyle.emphasized} >Checkworthy</Card.Title>
                                <ButtonGroup style={{ marginRight: '10px' }} vertical>
                                    {labels.filter(label => label[splitField] === splitValue).map((label) =>
                                        <ToggleButton
                                            key={label.keyStroke}
                                            id={`radio-${label.keyStroke}`}
                                            type="radio"
                                            variant='outline-success'
                                            name="radio"
                                            value={label.label}
                                            checked={radioValue === label.label}
                                            onChange={(e) => {
                                                setRadioValue(e.currentTarget.value);
                                                postToAPI(utterance.uuid, qualifier, label.label, agent);
                                            }}
                                        >
                                            {label.label}
                                        </ToggleButton>
                                    )}
                                </ButtonGroup>
                            </Col>
                        );
                    })}
                </Row>

            </Card.Body>
        </Card>
    );
}