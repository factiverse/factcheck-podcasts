import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Row, Col, Card, Alert, ToggleButton, ButtonGroup } from 'react-bootstrap';
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

export default function ExclusiveSelector({ qualifier, classification, agent, labels, splitField, utterance, updateFunction }) {
    const [radioValue, setRadioValue] = useState('');
    const [category, setCategory] = useState(''); //e.g. checkworthy vs. non-checkworthy

    // get the unique values in the category field of the dictionaries in the labels list
    const categories = [...new Set(labels.labels.map(item => item.category))];
    useEffect(() => {
        setRadioValue(classification ? labels.labels.filter((item) => item.label === classification.label)[0].label : '');
        setCategory(classification ? labels.labels.filter((item) => item.category == classification.category)[0].category : '');
    }, [utterance, classification]);

    return (
        <Card>
            <Card.Header>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Card.Title>{qualifier}</Card.Title>
                    <HelpPopUp
                        header={labels.helpHeader}
                        text={labels.helpText}
                        qualifier={qualifier} />
                </div>
            </Card.Header>


            <Card.Body>
                <Card.Title>{labels.instruction1}</Card.Title>
                <Card.Text>
                    {labels.instruction2}
                </Card.Text>
                <Row>
                    {categories.map((cat) => {
                        return (
                            <Col key={cat}>
                                <Alert key={`alert-${labels.key}`} variant={category === cat ? "primary" : "light"} className='p-1'>
                                    <h5>{cat}</h5>
                                </Alert>
                                <ButtonGroup vertical role="radiogroup" className='mt-1 mb-3'>
                                    {labels.labels.filter(label => label[splitField] === cat).map((label) =>
                                        <HelpTooltipButton
                                            text={label.help}
                                            button={
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
                                                            updateFunction();
                                                        } else {
                                                            setRadioValue(label.label);
                                                            setCategory(cat);
                                                            postToAPI(utterance.uuid, qualifier, cat, label.label, agent);
                                                            updateFunction();
                                                        }
                                                    }}
                                                    role="radio"
                                                    aria-checked={radioValue === label.label}
                                                >
                                                    {label.label}
                                                </ToggleButton>
                                            }
                                            key={label.label}
                                        />

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