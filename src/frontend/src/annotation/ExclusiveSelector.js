import React, { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import axios from "axios";
import Card from 'react-bootstrap/Card';

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
    const categories = [...new Set(labels.map(item => item.category))];

    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/classifications/" + utterance.uuid + "/",
        }).then((response) => {
            const data = response.data;
            if (data.length > 0) {
                const currentValue = data.filter((item) => item.qualifier === qualifier).shift();
                setRadioValue(currentValue.label);
                setCategory(labels.filter((item) => item.label === currentValue.label).shift().category);

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
            <Card.Header>{qualifier}</Card.Header>
            <Card.Body>
                <Row>
                    {categories.map((cat) => {
                        return (
                            <Col key={cat}>
                                <Card.Title style={category === cat ? headerStyle.emphasized : headerStyle.deactivated} id={`${cat}-header`} tabIndex="0">{cat}</Card.Title>
                                <ButtonGroup style={{ marginRight: '10px' }} vertical role="radiogroup" aria-labelledby={`${cat}-header`}>
                                    {labels.filter(label => label[splitField] === cat).map((label) =>
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
                                                const cat = labels.filter((item) => item.label === e.currentTarget.value).shift().category;
                                                setCategory(cat);
                                                postToAPI(utterance.uuid, qualifier, cat, label.label, agent);
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