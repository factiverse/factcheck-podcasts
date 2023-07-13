import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, ToggleButton, ButtonGroup } from 'react-bootstrap';
import HelpPopUp from './help/HelpPopUp';
import HelpTooltipButton from './help/HelpTooltipButton';
import { FaCheck, FaTimes } from 'react-icons/fa';
import CircleFirstLetter from './help/CircleFirstLetter';


export default function ExclusiveSelector({ qualifier, classification, agent, labels, splitField, utterance, postToAPI, isExpedited }) {
    const [radioValue, setRadioValue] = useState('');
    const [category, setCategory] = useState(''); //e.g. checkable vs. non-checkable

    // if isExpedited is true, and no classification exists, then just post labels.expeditedValue to the API
    useEffect(() => {
        if (isExpedited && !classification && labels.expeditedValue) {
            postToAPI(utterance.uuid, qualifier, labels.expeditedCategory, labels.expeditedValue, agent);
        }
    }, [isExpedited, classification]);

    // get the unique values in the category field of the dictionaries in the labels list
    const categories = [...new Set(labels.labels.map(item => item.category))];
    useEffect(() => {
        setRadioValue(classification ? labels.labels.filter((item) => item.label === classification.label)[0]?.label : '');
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
                <Card.Text dangerouslySetInnerHTML={{ __html: labels.instruction2 }}>
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
                                            utterance={utterance}
                                            label={label}
                                            button={
                                                <ToggleButton
                                                    key={`radio-${labels.key}-${label.keyStroke}`}
                                                    className='p-1 ifc-button'
                                                    size='md'
                                                    id={`radio-${labels.key}-${label.keyStroke}`}
                                                    type="radio"
                                                    variant='outline-secondary'
                                                    name={`radio-${labels.key}`}
                                                    value={label.label}
                                                    checked={radioValue === label.label}
                                                    onClick={(e) => {
                                                        e.preventDefault(); // prevent the default action (scroll / move caret)
                                                        e.stopPropagation(); // prevent the event from bubbling up
                                                        console.log("clicking radio button", label.label, radioValue, label.label === radioValue)
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
                                                    aria-checked={radioValue === label.label}
                                                >
                                                    <strong>{label.isKeyboardShortcut ? <CircleFirstLetter text={label.label} /> : label.label}</strong>
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