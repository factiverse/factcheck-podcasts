import React, { useState } from 'react';
import { Form, Card, Row, Col } from 'react-bootstrap';
import HelpPopUp from '../help/HelpPopUp';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { helpPopUpData } from '../help/help';


export default function Diarization({ qualifier, agentSession, setAgentSession, agentSessionUpdated, setAgentSessionUpdated }) {
    const [diarization, setDiarization] = useState([]);

    const handleInputChange = (e) => {
        setAgentSession({
            ...agentSession,
            diarization: {
                ...agentSession.diarization,
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleBlur = (e) => {
        setAgentSession({
            ...agentSession,
            diarization: {
                ...agentSession.diarization,
                [e.target.name]: e.target.value,
            },
        });
        setAgentSessionUpdated(!agentSessionUpdated);
    };
    
    return (
        <Card>
            <Card.Header className='pb-0'>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Card.Title>{helpPopUpData[qualifier].cardTitle}</Card.Title>
                    <div className='pb-2'>
                        {agentSession.diarization && Object.values(agentSession.diarization).every((val) => val.length > 1) ? (
                            <span style={{ color: 'green', marginRight: '5px' }}>
                                <FaCheck />
                            </span>
                        ) : (
                            <span style={{ color: 'orange', marginRight: '5px' }}>
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
                        <span dangerouslySetInnerHTML={{ __html: helpPopUpData[qualifier].cardInstructionBody }}></span>
                    </Card.Text>
                }
                <Form>
                    {agentSession.diarization && Object.keys(agentSession.diarization).sort().map((key, index) => (
                        <Form.Group as={Row} key={index} className='pb-2'>
                            <Form.Label column sm="auto">{key}</Form.Label>
                            <Col>
                                <Form.Control
                                    type="text"
                                    name={key}
                                    value={agentSession.diarization[key]}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                            </Col>
                        </Form.Group>
                    ))}
                </Form>
            </Card.Body>
        </Card>
    );
}
