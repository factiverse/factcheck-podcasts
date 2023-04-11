import React, { useState, useEffect } from 'react';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import FactCheckDocument from './FactCheckDocument';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';
import { searchPlatforms } from './data.js';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

const postToAPI = (utterance, factChecks) => {

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
    if (newfactChecks.length > 0) {
        axios.post('/api/factchecks/' + utterance.uuid + "/", newfactChecks)
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
    }
};

const createEmptyFactCheck = (agent) => {
    return {
        query: "",
        platform: null,
        agent: agent,
        document_set: [
            {
                document: "",
                supports: null,
                agent: agent,
                comment: ""
            },
        ],
    };
};

export default function FactCheck({ utterance, agent }) {
    const [factChecks, setFactChecks] = useState([createEmptyFactCheck(agent)]);
    const [activeFactCheck, setActiveFactCheck] = useState(`fc-0-pane`);
    const [platformDropdown, setPlatformDropdown] = useState('Platform');

    useEffect(() => {
        axios({
            method: "GET",
            url: "/api/factchecks/" + utterance.uuid + "/",
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

    function handlePlatformDropdownClick(platform, fc_idx) {
        setPlatformDropdown(platform);
        // Update the state with the selected item
        // You can use the same approach as in your previous code snippet
        const newFactChecks = [...factChecks];
        newFactChecks[fc_idx].platform = platform;
        setFactChecks(newFactChecks);
        postToAPI(utterance, newFactChecks);
    }


    return (
        <>
            <Card key={`factcheck-utt-${utterance.uuid}`}>
                <Card.Header><Card.Title>Fact Check</Card.Title></Card.Header>
                <Card.Body>
                    <Form>
                        <Tab.Container activeKey={activeFactCheck}>
                            <Nav fill variant="tabs" onSelect={(selectedKey) => {
                                setActiveFactCheck(selectedKey);
                            }}>
                                {factChecks.map((fc, i) => (
                                    <Nav.Item key={`fc-${i}-navitem`}>
                                        <Nav.Link key={`fc-${i}-tab`} eventKey={`fc-${i}-pane`}>
                                            {i + 1}

                                            {/* Delete factcheck button */}
                                            {i != 0 && <Badge
                                                pill
                                                bg="danger"
                                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent the default behavior of the Nav.Link
                                                    const newFactChecks = factChecks.filter((_, index) => index !== i);
                                                    setFactChecks(newFactChecks);
                                                    setActiveFactCheck(`fc-${newFactChecks.length - 1}-pane`); // Set the active key to the last fact check
                                                    postToAPI(utterance, newFactChecks);
                                                }}
                                            >
                                                &times;
                                            </Badge>}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                                {/* Add new factcheck button */}
                                <Nav.Item className="ml-auto" key={`add-factcheck-button`}>
                                    <Badge
                                        pill
                                        variant="success"
                                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newFactChecks = [...factChecks];
                                            newFactChecks.push(createEmptyFactCheck(agent));
                                            setFactChecks(newFactChecks);
                                            setActiveFactCheck(`fc-${newFactChecks.length - 1}-pane`); // Set the active key to the newly added fact check
                                        }}
                                    >
                                        +
                                    </Badge>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                {factChecks.map((fc, i) => (
                                    <Tab.Pane key={`fc-${i}-pane`} eventKey={`fc-${i}-pane`} title={i}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>search phrase or link to search</Form.Label>
                                            <InputGroup className="mb-3">

                                                <DropdownButton
                                                    variant="outline-secondary"
                                                    title={fc.platform ? fc.platform : "Platform"}
                                                    id={`fc-${i}-platform-dropdown`}
                                                    key={`fc-${i}-platform-dropdown`}
                                                >
                                                    
                                                {/* PLATFORM DROPDOWN: */}
                                                {searchPlatforms.map((platform) => (

                                                    <DropdownItem
                                                        href="#"
                                                        key={`fc-${i}-platform-dropdown-${platform.key}`}
                                                        onClick={() => {
                                                            handlePlatformDropdownClick(platform.name, i);
                                                        }}
                                                    >{platform.name}
                                                    </DropdownItem>
                                                ))}
                                                </DropdownButton>
                                                {/* QUERY URL: */}
                                                <Form.Control
                                                    type="text"
                                                    placeholder="https://www.google.com/search?q=..."
                                                    autoComplete="off"
                                                    value={fc.query}
                                                    onChange={
                                                        (e) => {
                                                            const newFactChecks = [...factChecks];
                                                            newFactChecks[i].query = e.target.value;
                                                            setFactChecks(newFactChecks);
                                                        }}
                                                    onBlur={
                                                        (e) => {
                                                            postToAPI(utterance, factChecks);
                                                        }} />
                                            </InputGroup>
                                        </Form.Group>

                                        {/* Check if fc.document_set is empty and render a default FactCheckDocument */}
                                        {(fc.document_set.length === 0 ? [createEmptyFactCheck(agent).document_set[0]] : fc.document_set).map((doc, j) => (
                                            <FactCheckDocument
                                                document={doc}
                                                fc_idx={i}
                                                doc_idx={j}
                                                factChecks={factChecks}
                                                setFactChecks={setFactChecks}
                                                key={`fc-${i}-${j}`}
                                                postToAPI={postToAPI}
                                                utterance={utterance} />
                                        ))}
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Tab.Container>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}
