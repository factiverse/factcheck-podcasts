import React, { useState, useEffect } from 'react';
import axios from "axios";
import FactCheckDocument from './FactCheckDocument';
import { Badge, Nav, Tab, Form, Card } from 'react-bootstrap';
import HelpPopUp from '../help/HelpPopUp';
import FactCheckQuery from './FactCheckQuery';
import { FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { helpPopUpData } from '../help/help';
import { validateAnnotations } from '../../util/validate';

const qualifier = 'Factcheck';
const createEmptyFactCheck = (agent) => {
    return {
        query: null,
        platform: null,
        agent: agent,
        valid: false,
        document_set: [
            {
                document: null,
                supports: null,
                agent: agent,
                comment: null,
                valid: false,
            },
        ],
    };
};

const allValid = (fc) => {
    return fc.valid && fc.document_set.length > 0 && fc.document_set.every((doc) => {
        return doc.valid;
    });
};
export default function FactCheck({ utterance, setUtterance, agent }) {
    const [factChecks, setFactChecks] = useState();
    const [activeFactCheck, setActiveFactCheck] = useState('');
    // Fact check shows complete (allows progress to next card) if any of the fact checks are valid
    const [isValid, setIsValid] = useState(false);

    const postToAPI = (utterance, factChecks, agent) => {
        // filter the factChecks to remove any where the query is empty
        // and do the same for the document_set where the document is empty
        const newfactChecks = factChecks.filter((fc) => {
            if (fc.query.length > 0) {
                fc.document_set = fc.document_set.filter((doc) => {
                    return doc.document && doc.document.length > 0;
                });
                return true;
            }
            return false;
        });
        const data = { agent: agent, queries: newfactChecks }
        axios.post('/api/factchecks/' + utterance.uuid + "/", data)
            .then((response) => {
                setUtterance({ ...utterance, query_set: response.data });
                //setFactChecks(response.data);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };


    useEffect(() => {
        if (utterance.query_set.length > 0) {
            setFactChecks(utterance.query_set);
            setActiveFactCheck(`fc-${utterance.query_set.length - 1}-pane`);
        } else {
            setFactChecks([createEmptyFactCheck(agent)]);
            setActiveFactCheck(`fc-0-pane`);
        }
    }, [utterance]);


    // update the isValid state whenever the factChecks state changes
    useEffect(() => {
        setIsValid(factChecks?.every((fc) => allValid(fc)));
    }, [utterance, utterance.query_set, factChecks]);


    // check if the utterance has a checkworthy classification, and if not, set the factChecks to empty
    useEffect(() => {
        const checkworthyClassification = utterance.classification_set.find(
            (classification) => (
                classification.qualifier === 'Checkworthiness' &&
                classification.category === 'Checkworthy'
            )
        );

        if (!checkworthyClassification) {
            setFactChecks([]);
            setUtterance({ ...utterance, query_set: [] });
            postToAPI(utterance, [], agent);
        }
    }, [utterance.classification_set]);

    return (
        <Card key={`factcheck-utt-${utterance.uuid}`}>
            <Card.Header className='pb-0'>
                <div className="d-flex justify-content-between">
                    <Card.Title>{helpPopUpData[qualifier].cardTitle}</Card.Title>
                    <div>
                        {validateAnnotations({utterance_set: [utterance]}, 0, 0, true).complete ? (
                            <span style={{ color: 'green', marginRight: '5px' }}>
                                <FaCheck />
                            </span>
                        ) : (
                            <span style={{ color: 'red', marginRight: '5px' }}>
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
            <Card.Body>
                <Card.Title>{helpPopUpData[qualifier].cardInstructionHeader}</Card.Title>
                <Card.Text>{helpPopUpData[qualifier].cardInstructionBody}</Card.Text>
            </Card.Body>
            <Card.Body className="pb-0">
                <Form>
                    <Tab.Container activeKey={activeFactCheck}>
                        <Nav fill variant="tabs" onSelect={(selectedKey) => {
                            setActiveFactCheck(selectedKey);
                        }}>
                            {factChecks?.map((fc, i) => (
                                <Nav.Item key={`fc-${i}-navitem`}>
                                    <Nav.Link key={`fc-${i}-tab`} eventKey={`fc-${i}-pane`}>
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <span>{i + 1}</span>
                                                {/* check if the fact check, and all its child documents have valid=true */}
                                                {allValid(fc) ? (
                                                    <span style={{ color: 'green', marginLeft: '5px' }}>
                                                        <FaCheck />
                                                    </span>
                                                ) : (
                                                    <span style={{ color: 'red', marginLeft: '5px' }}>
                                                        <FaTimes />
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                {/* Delete factcheck button */}
                                                {i != 0 && <Badge
                                                    pill
                                                    className='p-1'
                                                    bg="danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent the default behavior of the Nav.Link
                                                        e.preventDefault(); // Prevent the default behavior of the Nav.Link
                                                        const newFactChecks = factChecks.filter((_, index) => index !== i);
                                                        setFactChecks(newFactChecks);
                                                        setActiveFactCheck(`fc-${newFactChecks.length - 1}-pane`);
                                                        postToAPI(utterance, newFactChecks, agent, setUtterance);
                                                    }}
                                                >
                                                    <span style={{ color: 'white' }}>
                                                        <FaTimes />
                                                    </span>
                                                </Badge>}
                                            </div>
                                        </div>
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                            {/* Add new factcheck button */}
                            <Nav.Item className="ml-auto" key={`add-factcheck-button`}>
                                <Badge
                                    pill
                                    variant="success"
                                    className='p-1'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        const newFactChecks = [...factChecks];
                                        newFactChecks.push(createEmptyFactCheck(agent));
                                        setFactChecks(newFactChecks);
                                        setActiveFactCheck(`fc-${newFactChecks.length - 1}-pane`);
                                        setUtterance({ ...utterance, query_set: newFactChecks });
                                    }}
                                >
                                    <FaPlus />
                                </Badge>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            {factChecks?.map((fc, i) => (
                                <Tab.Pane key={`fc-${i}-pane`} eventKey={`fc-${i}-pane`} title={i}>

                                    {/* FACT CHECK QUERY */}
                                    <FactCheckQuery
                                        fc_idx={i}
                                        factChecks={factChecks}
                                        setFactChecks={setFactChecks}
                                        postToAPI={postToAPI}
                                        utterance={utterance}
                                        agent={agent}
                                    />

                                    {/* FACT CHECK*/}
                                    {(fc.document_set.length === 0 ?
                                        [createEmptyFactCheck(agent).document_set[0]] : fc.document_set).map((doc, j) => (
                                            <FactCheckDocument
                                                fc_idx={i}
                                                doc_idx={j}
                                                factChecks={factChecks}
                                                setFactChecks={setFactChecks}
                                                key={`fc-${i}-${j}`}
                                                postToAPI={postToAPI}
                                                agent={agent}
                                                utterance={utterance}
                                            />
                                        ))}
                                </Tab.Pane>
                            ))}
                        </Tab.Content>
                    </Tab.Container>
                </Form>
            </Card.Body>
        </Card>
    );
}
