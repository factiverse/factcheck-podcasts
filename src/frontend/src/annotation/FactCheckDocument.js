import React, { useRef } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

const radios = [
    { name: 'Refutes', value: 1 },
    { name: 'Not Relevant', value: 2 },
    { name: 'Supports', value: 3 },
];


export default function FactCheckDocument({ document, fc_idx, doc_idx, factChecks, setFactChecks, postToAPI, utterance }) {
    const inputRef = useRef(null);

    return (
        <Form.Group className="mb-3">
            <Form.Label>link to fact check document</Form.Label>
            <InputGroup className="mb-3">
                {/* EVIDENCE URL: */}
                <Form.Control
                    type="text"
                    readOnly={!factChecks[fc_idx].query || factChecks[fc_idx].query.length === 0}
                    placeholder=""
                    autoComplete="off"
                    ref={inputRef}
                    value={document.document ? document.document : ''}
                    onChange={
                        (e) => {
                            const newFactChecks = [...factChecks];
                            // set the document object's document field to the current target value
                            // creating a new object if one doesn't already exist
                            if (!newFactChecks[fc_idx].document_set[doc_idx]) {
                                newFactChecks[fc_idx].document_set[doc_idx] = {};
                            }
                            newFactChecks[fc_idx].document_set[doc_idx].document = e.currentTarget.value;
                            setFactChecks(newFactChecks);
                        }}
                    onBlur={
                        (e) => {
                            postToAPI(utterance, factChecks);
                        }
                    } />

                {/* REFUTES / NOT RELEVANT / SUPPORTS buttons */}
                <ButtonGroup>
                    {radios.map((radio, k) => (
                        <ToggleButton
                            key={`radio-doc-${fc_idx}-${doc_idx}-${k}`}
                            id={`radio-doc-${fc_idx}-${doc_idx}-${k}`}
                            type="radio"
                            variant='outline-success'
                            size='sm'
                            name={`radio-doc-${fc_idx}-${doc_idx}`}
                            value={radio.value}
                            checked={document.supports == radio.value}
                            disabled={!document.document}
                            onClick = {!document.document ? inputRef.current ? inputRef.current.focus() : null : null } 
                            onChange={
                                (e) => {
                                    const newFactChecks = [...factChecks];
                                    newFactChecks[fc_idx].document_set[doc_idx].supports = e.currentTarget.value;
                                    setFactChecks(newFactChecks);
                                    postToAPI(utterance, newFactChecks);
                                }
                            }
                        >
                            {radio.name}
                        </ToggleButton>
                    ))}
                    {/* ADD + / REMOVE - buttons */}
                    {doc_idx > 0 &&
                        <Button
                            key={`remove-doc-${fc_idx}-${doc_idx}`}
                            size='sm'
                            onClick={
                                (e) => {
                                    // remove the document
                                    const newFactChecks = [...factChecks];
                                    newFactChecks[fc_idx].document_set.splice(doc_idx, 1);
                                    setFactChecks(newFactChecks);
                                    postToAPI(utterance, newFactChecks);
                                }
                            }
                        >-</Button>}
                    {doc_idx >= factChecks[fc_idx].document_set.length - 1 &&
                        <Button
                            key={`add-doc-${fc_idx}-${doc_idx}`}
                            disabled={!document.document}
                            size='sm'
                            onClick={
                                (e) => {
                                    const newFactChecks = [...factChecks];
                                    newFactChecks[fc_idx].document_set.push({
                                        document: "",
                                        support: "",
                                        comment: "",
                                    });
                                    setFactChecks(newFactChecks);
                                }
                            }
                        >+</Button>}
                </ButtonGroup>
            </InputGroup>
            <InputGroup className="mb-3">
                {/* COMMENT: input field for a comment made on this document which will be sent back to api also*/}
                <Form.Control

                    type="text"
                    readOnly={!factChecks[fc_idx].query || factChecks[fc_idx].query.length === 0}
                    placeholder="Relevant Snippet or Comment"
                    autoComplete="off"
                    disabled={!document.document}
                    value={document.comment ? document.comment : ""}
                    onChange={
                        (e) => {
                            const newFactChecks = [...factChecks];
                            // set the document object's comment field to the current target value
                            // creating a new object if one doesn't already exist
                            if (!newFactChecks[fc_idx].document_set[doc_idx]) {
                                newFactChecks[fc_idx].document_set[doc_idx] = {};
                            }
                            newFactChecks[fc_idx].document_set[doc_idx].comment = e.currentTarget.value;
                            setFactChecks(newFactChecks);
                        }}
                    onBlur={
                        (e) => {
                            postToAPI(utterance, factChecks);
                        }

                    } />
            </InputGroup>

        </Form.Group>
    )

}