import React, { useState, useEffect } from 'react';
import axios from "axios";
import FactCheckDocument from './FactCheckDocument';
import { Badge, Nav, Tab, Form, Card } from 'react-bootstrap';
import HelpPopUp from './HelpPopUp';
import FactCheckQuery from './FactCheckQuery';
import { FaCheck, FaTimes, FaPlus } from 'react-icons/fa';


const createEmptyFactCheck = (agent) => {
    return {
        query: "",
        platform: null,
        agent: agent,
        valid: false,
        document_set: [
            {
                document: "",
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

export default function FactCheck({ utterance, setUtterance, agent, setAnnotationComplete }) {
    const [factChecks, setFactChecks] = useState([createEmptyFactCheck(agent)]);
    const [activeFactCheck, setActiveFactCheck] = useState(`fc-0-pane`);
    // Fact check shows complete (allows progress to next card) if any of the fact checks are valid
    const [isValid, setIsValid] = useState(factChecks.every((fc) => allValid(fc)));

    const postToAPI = (utterance, factChecks, agent) => {
        // filter the factChecks to remove any where the query is empty
        // and do the same for the document_set where the document is empty
        const newfactChecks = factChecks.filter((fc) => {
            if (fc.query.length > 0) {
                fc.document_set = fc.document_set.filter((doc) => {
                    return doc.document.length > 0;
                });
                return true;
            }
            return false;
        });
        const data = { agent: agent, queries: newfactChecks }
        axios.post('/api/factchecks/' + utterance.uuid + "/", data)
            .then((response) => {
                setUtterance({ ...utterance, query_set: response.data });
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    };
    

    // sync the factChecks state with the utterance.query_set state from props
    useEffect(() => {
        if (utterance.query_set.length > 0) {
            setFactChecks(utterance.query_set);
        } else {
            setFactChecks([createEmptyFactCheck(agent)]);
        }
    }, [utterance, utterance.query_set]);

    // update the isValid state whenever the factChecks state changes
    useEffect(() => {
        setIsValid(factChecks.every((fc) => allValid(fc)));
    }, [utterance, utterance.query_set, factChecks]);

    // check if this task card is completed, and set its entry in the annotationComplete object
    useEffect(() => {
        setAnnotationComplete((prevAnnotationComplete) => ({
            ...prevAnnotationComplete,
            'factcheck': isValid
        }));
    }, [isValid]);

    // get factchecks from API
    /*useEffect(() => {
        axios({
            method: "GET",
            url: `/api/factchecks/${utterance.uuid}?PROLIFIC_PID=${agent.PROLIFIC_PID}${agent.STUDY_ID ? `&STUDY_ID=${agent.STUDY_ID}` : ''}${agent.SESSION_ID ? `&SESSION_ID=${agent.SESSION_ID}` : ''}`,
        }).then((response) => {
            const data = response.data;
            if (data.length > 0) {
                // if any of the fact checks have an empty document set,
                // add the document set from createEmptyFactCheck() to it so it shows up in the UI
                data.forEach((fc) => {
                    if (fc.document_set.length === 0) {
                        fc.document_set = createEmptyFactCheck(agent).document_set;
                    }
                });

                setFactChecks(data);
            } else {
                setFactChecks([createEmptyFactCheck(agent)]);
            }
            setActiveFactCheck(`fc-0-pane`);

        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    }, [utterance, agent]);
    */

    return (
        <Card key={`factcheck-utt-${utterance.uuid}`}>
            <Card.Header className='pb-0'>
                <div className="d-flex justify-content-between">
                    <Card.Title>Fact Check</Card.Title>
                    <div>
                        {isValid ? (
                            <span style={{ color: 'green', marginRight: '5px' }}>
                                <FaCheck />
                            </span>
                        ) : (
                            <span style={{ color: 'red', marginRight: '5px' }}>
                                <FaTimes />
                            </span>
                        )}
                        <HelpPopUp
                            header={"Carry out a basic fact check on the statement."}
                            text={"Here you will search with a search engine and record the search phrase you use (or simply paste the link to the search results page in). You can also add a link to a search engine result. If you find a result that supports the statement, you can add it to the document set. If you find a result that does not support the statement, you can add it to the document set and mark it as false. You can also add a comment to the document."}
                            qualifier={"factcheck"} />
                    </div>
                </div>
            </Card.Header>
            <Card.Body className="pb-0">
                <Form>
                    <Tab.Container activeKey={activeFactCheck}>
                        <Nav fill variant="tabs" onSelect={(selectedKey) => {
                            setActiveFactCheck(selectedKey);
                        }}>
                            {factChecks.map((fc, i) => (
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
                                                        setActiveFactCheck(`fc-${newFactChecks.length - 1}-pane`); // Set the active key to the last fact check
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
                                        e.preventDefault();
                                        const newFactChecks = [...factChecks];
                                        newFactChecks.push(createEmptyFactCheck(agent));
                                        setFactChecks(newFactChecks);
                                        setActiveFactCheck(`fc-${newFactChecks.length - 1}-pane`); // Set the active key to the newly added fact check
                                    }}
                                >
                                    <FaPlus />
                                </Badge>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            {factChecks.map((fc, i) => (
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
                                    {(fc.document_set.length === 0 ? [createEmptyFactCheck(agent).document_set[0]] : fc.document_set).map((doc, j) => (
                                        <FactCheckDocument
                                            document={doc}
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
