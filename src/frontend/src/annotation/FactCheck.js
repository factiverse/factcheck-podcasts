import React, { useState, useEffect } from 'react';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const postToAPI = (utterance, query, platform, agent, document_set) => {
    axios.post('/api/factcheck/' + utterance + "/", {
        utterance,
        query,
        platform,
        agent,
        document_set,
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



export default function FactCheck({ utterance }) {
    const [factChecks, setFactChecks] = useState([{
        uuid: "uuid1",
        query: "testq",
        platform: "google",
        agent: "test_user1",
        document_set: [{
            uuid: "quuid1",
            document: 'https://www.facts.com/1',
            support: 2,
            comment: "test comment1",
        }]
    }, {
        uuid: "uuid2",
        query: "testq2",
        platform: "google",
        agent: "test_user2",
        document_set: [{
            uuid: "quuid3",
            document: 'https://www.facts.com/3',
            support: 2,
            comment: "test comment3",
        }, {
            uuid: "quuid4",
            document: 'https://www.facts.com/4',
            support: 1,
            comment: "test comment4",
        }]
    }]);

    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/factchecks/" + utterance.uuid + "/",
        }).then((response) => {
            const data = response.data;
            if (data.length > 0) {
                setFactChecks(data);
            }

        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
    }, [utterance]);

    const radios = [
        { name: 'Refutes', value: 1 },
        { name: 'Not Relevant', value: 2 },
        { name: 'Supports', value: 3 },
    ];

    // a function which sets the value of the support field in a document given query i and document j
    const setSupport = (i, j, value) => {
        const newFactChecks = [...factChecks];
        newFactChecks[i].document_set[j].support = value;
        setFactChecks(newFactChecks);
    }

    return (
        <Card>
            <Card.Header>Fact Check</Card.Header>
            <Card.Body>
                <Form>
                    <Tabs>
                        {factChecks.map((fc, i) => (
                            <Tab.Pane key={fc.uuid} eventKey={fc.uuid} title={fc.uuid}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>URL to Search Results Page</Form.Label>
                                    <Form.Control type="text" placeholder="https://www.google.com/search?q=..." autoComplete="off" value={fc.query} />
                                </Form.Group>

                                {fc.document_set.map((doc, j) => (
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                        <Form.Label>URL to document from results</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control type="text" placeholder="" autoComplete="off" value={doc.document} />
                                            <ButtonGroup>
                                                {radios.map((radio, k) => (
                                                    <ToggleButton
                                                        key={`radio-doc-${i}-${j}-${k}`}
                                                        id={`radio-doc-${i}-${j}-${k}`}
                                                        type="radio"
                                                        variant='outline-success'
                                                        name={`radio-doc-${i}-${j}`}
                                                        value={radio.value}
                                                        checked={doc.support == radio.value}
                                                        onChange={
                                                            (e) => {
                                                                setSupport(i, j, e.currentTarget.value);
                                                            }
                                                        }
                                                    >
                                                        {radio.name}
                                                    </ToggleButton>
                                                ))}
                                            </ButtonGroup>
                                            {j > 0 &&
                                                <Button
                                                    onClick={
                                                        (e) => {
                                                            // remove the document
                                                            const newFactChecks = [...factChecks];
                                                            newFactChecks[i].document_set.splice(j, 1);
                                                        }
                                                    }
                                                >-</Button>}
                                            {j === fc.document_set.length - 1 &&
                                                <Button
                                                    onClick={
                                                        (e) => {
                                                            const newFactChecks = [...factChecks];
                                                            newFactChecks[i].document_set.push({
                                                                document: "",
                                                                support: "",
                                                                comment: "",
                                                            });
                                                            setFactChecks(newFactChecks);
                                                        }
                                                    }
                                                >+</Button>}
                                        </InputGroup>
                                    </Form.Group>
                                ))}
                            </Tab.Pane>
                        ))}
                        

                    </Tabs>
                    <Button onClick={
                            // add a new fact check
                            (e) => {
                                e.preventDefault();
                                const newFactChecks = [...factChecks];
                                newFactChecks.push({
                                    uuid: "new",
                                    query: "",
                                    platform: "",
                                    agent: "",
                                    document_set: [{
                                        document: "",
                                        support: "",
                                        comment: "",
                                    }]
                                });
                                setFactChecks(newFactChecks);
                                console.log(factChecks);
                            }}>add nnew</Button>
                </Form>
            </Card.Body>
        </Card >
    );
}
