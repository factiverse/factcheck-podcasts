import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Row, Col, Card, Alert, ToggleButton, ButtonGroup } from 'react-bootstrap';
import HelpPopUp from './help/HelpPopUp';
import HelpTooltipButton from './help/HelpTooltipButton';
import { FaCheck, FaTimes } from 'react-icons/fa';



export default function ExclusiveSelector({ qualifier, classification, agent, labels, splitField, utterance, setUtterance }) {
    const [radioValue, setRadioValue] = useState('');
    const [category, setCategory] = useState(''); //e.g. checkworthy vs. non-checkworthy

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

    // get the unique values in the category field of the dictionaries in the labels list
    const categories = [...new Set(labels.labels.map(item => item.category))];
    useEffect(() => {
        setRadioValue(classification ? labels.labels.filter((item) => item.label === classification.label)[0].label : '');
        setCategory(classification ? labels.labels.filter((item) => item.category == classification.category)[0].category : '');
    }, [classification]);

    return (
        <Card>
            <Card.Header className='pb-0'>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Card.Title>{qualifier}</Card.Title>
                    <div className='pb-2'>
                        {radioValue ? (
                            <span style={{ color: 'green', marginRight: '5px' }}>
                                <FaCheck />
                            </span>
                        ) : (
                            <span style={{ color: 'red', marginRight: '5px' }}>
                                <FaTimes />
                            </span>
                        )}
                        <HelpPopUp
                            header={labels.helpHeader}
                            text={labels.helpText}
                            qualifier={qualifier} />
                    </div>
                </div>
            </Card.Header>


            <Card.Body className='pt-1 pb-1'>
                <Card.Title>{labels.instruction1}</Card.Title>
                <Card.Text>
                    {labels.instruction2}
                </Card.Text>
                <Row>
                    {categories.map((cat) => {
                        return (
                            <Col key={cat}>
                                <Alert
                                    key={`alert-${labels.key}`}
                                    variant={category === cat ? "primary" : "light"}
                                    className='p-1 pb-0 mb-0'>
                                    <h5>{cat}</h5>
                                </Alert>
                                <ButtonGroup
                                    vertical role="radiogroup"
                                    className='my-1 pb-1'>
                                    {labels.labels.filter(label => label[splitField] === cat).map((label) =>
                                        <HelpTooltipButton
                                            label={label}
                                            button={
                                                <ToggleButton
                                                    key={`radio-${labels.key}-${label.keyStroke}`}
                                                    className='p-1'
                                                    size='md'
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