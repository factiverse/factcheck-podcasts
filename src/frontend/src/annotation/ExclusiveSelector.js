import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

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

const headerStyle = {
    deactivated: {
        backgroundColor: "#f8f9fa",
        color: "#6c757d",
        fontWeight: "normal",
    },
    emphasized: {
        backgroundColor: "#333333", // Use a more accessible color combination
        color: "#ffffff",
        fontWeight: "bold",
    },
};

export default function ExclusiveSelector({ qualifier, agent, labels, splitField, utterance }) {
    const [radioValue, setRadioValue] = useState('');
    const [category, setCategory] = useState(''); //e.g. checkworthy vs. non-checkworthy

    // get the unique values in the category field of the dictionaries in the labels list
    const categories = [...new Set(labels.labels.map(item => item.category))];

    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/classifications/" + utterance.uuid + "/",
        }).then((response) => {
            const data = response.data;
            if (data.length > 0) {
                const currentValue = data.filter((item) => item.qualifier === qualifier).shift();
                setRadioValue(currentValue.label);
                setCategory(labels.labels.filter((item) => item.label === currentValue.label).shift().category);

            } else {
                setRadioValue("");
                setCategory("");
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
            <Card.Header><Card.Title>{qualifier}</Card.Title></Card.Header>
            <Card.Body>
                <Card.Title>{labels.instruction1}</Card.Title>
                <Card.Text>
                    {labels.instruction2}
                </Card.Text>
                <Row>
                    {categories.map((cat) => {
                        return (
                            <Col key={cat}>
                                <Alert key={`alert-${labels.key}`} variant={category === cat ? "primary": "light"} className='p-1'>
                                    <h5>{cat}</h5>
                                </Alert>
                                <ButtonGroup vertical role="radiogroup" className='mt-1 mb-3'>
                                    {labels.labels.filter(label => label[splitField] === cat).map((label) =>
                                        <ToggleButton
                                            key={`radio-${labels.key}-${label.keyStroke}`}
                                            id={`radio-${labels.key}-${label.keyStroke}`}
                                            type="radio"
                                            variant='outline-secondary'
                                            name={`radio-${labels.key}`}
                                            value={label.label}
                                            checked={radioValue === label.label}
                                            onClick={(e) => {
                                                const selectedLabel = labels.labels.filter((item) => item.label === label.label).shift();
                                                const cat = selectedLabel ? selectedLabel.category : '';

                                                if (radioValue === label.label) {
                                                    setRadioValue('');
                                                    setCategory('');
                                                    postToAPI(utterance.uuid, qualifier, '', '', agent);
                                                } else {
                                                    setRadioValue(label.label);
                                                    setCategory(cat);
                                                    postToAPI(utterance.uuid, qualifier, cat, label.label, agent);
                                                }
                                            }}
                                            role="radio"
                                            aria-checked={radioValue === label.label}
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