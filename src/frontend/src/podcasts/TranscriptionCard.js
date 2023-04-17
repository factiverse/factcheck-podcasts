import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function getSpeech2TxtRowsRecursive(myDict, parentKey = '') {
    let rows = [];
    for (const key in myDict) {
        const newKey = parentKey ? `${parentKey}_${key}` : key;
        if (typeof myDict[key] === 'object') {
            rows = rows.concat(getSpeech2TxtRowsRecursive(myDict[key], newKey));
        } else {
            rows.push(
                <tr key={newKey}>
                    <th>{key}</th>
                    <td>{myDict[key].toString()}</td>
                </tr>
            );
        }
    }
    return rows;
}

export default function TranscriptionCard({ transcription, hideTranscriptionButton }) {
    const [open, setOpen] = useState(false);

    return (
        <Card style={{ minWidth: '25rem',  }}>
            <Card.Header>Transcription {transcription.name}</Card.Header>
            <Card.Body>
                <div className="d-flex justify-content-center">
                    {!hideTranscriptionButton && <ButtonGroup>
                        <Button
                            onClick={() => setOpen(!open)}
                            aria-controls="transcription-table-collapse"
                            aria-expanded={open}
                            variant="outline-secondary"
                        >
                            {open ? 'Hide Details' : 'Show Details'}
                        </Button>
                        <Button
                            as={Link}
                            variant="secondary"
                            target="_blank"
                            to={'/transcriptions/' + transcription.uuid}
                        >
                            View Transcript
                        </Button>
                    </ButtonGroup>}
                </div>

                <Collapse in={open}>
                    <div id="transcription-table-collapse">
                        <Table striped bordered hover size="sm" responsive className="mt-3">
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <th>created</th>
                                    <td>{transcription.created}</td>
                                </tr>
                                <tr>
                                    <th>running time</th>
                                    <td>{transcription.runtime}</td>
                                </tr>
                                <tr>
                                    <th>language</th>
                                    <td>{transcription.language}</td>
                                </tr>
                                {getSpeech2TxtRowsRecursive(transcription.speech2txt)}
                            </tbody>
                        </Table>
                    </div>
                </Collapse>

            </Card.Body>
            <Card.Header>Segmentations</Card.Header>
            <Card.Body>
                <ListGroup as="ol">
                    {transcription.segmentation_set ? transcription.segmentation_set.map((seg) =>
                        <React.Fragment key={`fragment-${seg.uuid}`}>
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">{seg.name}</div>
                                    <ButtonGroup>
                                        <Button
                                            as={Link}
                                            variant="secondary"
                                            target="_blank"
                                            to={'/segmentations/' + seg.uuid}
                                        >
                                            Segmentation
                                        </Button>
                                        <Button
                                            as={Link}
                                            variant="secondary"
                                            target="_blank"
                                            to={'/annotations/' + seg.uuid}
                                        >
                                            Annotations
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </ListGroup.Item>
                        </React.Fragment>
                    ) : <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">No segmentations</div>
                        </div>
                    </ListGroup.Item>}
                </ListGroup>
            </Card.Body>
        </Card>
    );
}
