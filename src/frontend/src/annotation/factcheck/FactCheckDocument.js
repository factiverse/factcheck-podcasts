import React, { useRef, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { FaCheck, FaTimes } from 'react-icons/fa';

const radios = [
    { name: 'Refutes', value: 1 },
    { name: 'Not Relevant', value: 2 },
    { name: 'Supports', value: 3 },
];

function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        return false;
    }
}

export default function FactCheckDocument({ fc_idx, doc_idx, factChecks, setFactChecks, postToAPI, utterance, agent }) {
    const inputRef = useRef(null);
    const [document, setDocument] = useState(factChecks[fc_idx].document_set[doc_idx]);
    const [radioValue, setRadioValue] = useState('');

    function validateDoc(newDoc) {
        const hasDocument = newDoc.document ? isValidURL(newDoc.document) && newDoc.document && newDoc.document.trim().length > 0 : false;
        const hasSupports = newDoc?.supports && newDoc.supports !== '';
        const hasComment = newDoc?.comment && newDoc.comment.trim().length > 0;
        const valid = hasDocument && hasSupports && hasComment;
        const newDocument = { ...newDoc, valid: valid ?? false };
        return newDocument;
    }

    useEffect(() => {
        setDocument(factChecks[fc_idx].document_set[doc_idx]);
    }, [factChecks, fc_idx, doc_idx]);


    useEffect(() => {
        setRadioValue(document?.supports ?? '');
    }, [document]);

    return (
        <Form.Group className="mb-3">
            <Form.Label className='d-flex mt-2'>
                <p className='m-0'>
                    <em>EVIDENCE</em> link to document returned by query
                </p>
            </Form.Label>
            <InputGroup className="mb-3">
                {/* EVIDENCE URL: */}
                <Form.Control
                    type="text"
                    placeholder="paste URL here"
                    autoComplete="off"
                    ref={inputRef}
                    value={document?.document ?? ''}
                    disabled={!factChecks[fc_idx].query || factChecks[fc_idx].query.length === 0 || !factChecks[fc_idx].platform}
                    onChange={
                        (e) => {
                            let newDocument = { ...document, document: e.target.value };
                            if (newDocument.document.length === 0) {
                                newDocument.document = null;
                                newDocument.supports = null;
                                newDocument.comment = null;
                                newDocument.valid = false;
                            }
                            const validatedDoc = validateDoc(newDocument);
                            setDocument(validatedDoc);
                            let newFactChecks = [...factChecks];
                            newFactChecks[fc_idx].document_set[doc_idx] = validatedDoc;
                            setFactChecks(newFactChecks);
                        }}
                    onBlur={
                        (e) => {
                            postToAPI(utterance, factChecks, agent);
                        }
                    }
                />

                {/* REFUTES / NOT RELEVANT / SUPPORTS buttons */}
                <ButtonGroup>
                    {radios.map((radio, k) => (
                        <ToggleButton
                            key={`radio-doc-${fc_idx}-${doc_idx}-${k}`}
                            id={`radio-doc-${fc_idx}-${doc_idx}-${k}`}
                            type="radio"
                            variant={radioValue == radio.value ? "outline-success" : "outline-secondary"}
                            size='sm'
                            name={`radio-doc-${fc_idx}-${doc_idx}`}
                            value={radio.value}
                            checked={radioValue == radio.value}
                            disabled={!document?.document}
                            //onClick={!document.document ? inputRef.current ? inputRef.current.focus() : null : null}
                            onChange={
                                (e) => {
                                    let newDocument = { ...document, supports: e.target.value };
                                    newDocument = validateDoc(newDocument);
                                    setDocument(newDocument);
                                    let newFactChecks = [...factChecks];
                                    newFactChecks[fc_idx].document_set[doc_idx] = newDocument;
                                    setFactChecks(newFactChecks);
                                    postToAPI(utterance, newFactChecks, agent);
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
                                    postToAPI(utterance, newFactChecks, agent);
                                }
                            }
                        >-</Button>}
                    {doc_idx >= factChecks[fc_idx].document_set.length - 1 &&
                        <Button
                            key={`add-doc-${fc_idx}-${doc_idx}`}
                            disabled={!document?.document}
                            size='sm'
                            onClick={
                                (e) => {
                                    const newFactChecks = [...factChecks];
                                    const newDoc = {
                                        document: null,
                                        support: null,
                                        comment: null,
                                        valid: false
                                    }
                                    newFactChecks[fc_idx].document_set.push(newDoc);
                                    setDocument(newDoc);
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
                    placeholder="Relevant Snippet or Comment"
                    autoComplete="off"
                    disabled={!document?.document}
                    value={document?.comment ?? ""}
                    onChange={
                        (e) => {
                            const newDocument = { ...document, comment: e.target.value.length > 0 ? e.target.value : null };
                            const validatedDoc = validateDoc(newDocument);
                            setDocument(validatedDoc);
                            let newFactChecks = [...factChecks];
                            newFactChecks[fc_idx].document_set[doc_idx] = validatedDoc;
                            setFactChecks(newFactChecks);
                        }}
                    onBlur={
                        (e) => {
                            postToAPI(utterance, factChecks, agent);
                        }

                    } />
                <InputGroup.Text className='ps-1' style={{ backgroundColor: "transparent" }}>
                    {document?.valid ? (
                        <span style={{ color: 'green', marginLeft: '5px' }}>
                            <FaCheck />
                        </span>
                    ) : (
                        <span style={{ color: 'red', marginLeft: '5px' }}>
                            <FaTimes />
                        </span>
                    )}
                </InputGroup.Text>
            </InputGroup>

        </Form.Group>
    )

}