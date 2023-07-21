import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Badge } from 'react-bootstrap';

function isUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function getSpeech2TxtRowsRecursive(myDict, parentKey = '') {
    let rows = [];
    for (const key in myDict) {
        const newKey = parentKey ? `${parentKey}_${key}` : key;
        if (typeof myDict[key] === 'object') {
            rows = rows.concat(getSpeech2TxtRowsRecursive(myDict[key], newKey));
        } else {
            const value = myDict[key].toString();
            rows.push(
                <tr key={newKey}>
                    <th>{key}</th>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                        {isUrl(value) ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a> : value}
                    </td>
                </tr>
            );
        }
    }
    return rows;
}

export default function TranscriptionCard({ transcription, hideTranscriptionButton, queryParams }) {
    const [open, setOpen] = useState(false);
    if (!queryParams) {
        queryParams = new URLSearchParams();
    }
    return (
        <Card className='mw-20'>
            <Card.Header>Segmentations</Card.Header>
            <Card.Body>
                <ListGroup as="ol">
                    {transcription.segmentation_set ? transcription.segmentation_set.sort((a, b) => a.name.localeCompare(b.name)).map((seg) =>
                    // only show the factiverse segmentations
                    <React.Fragment key={`fragment-${seg.uuid}`}>
                            {seg.name === "Factiverse CW/MO/CS" && (
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">Podcast</div>
                                    <ButtonGroup>
                                        <Button
                                            as={Link}
                                            variant="secondary"
                                            target="_blank"
                                            to={{ pathname: '/annotations/' + seg.uuid, search: queryParams.toString() }}
                                        >
                                            Annotations
                                        </Button>
                                    </ButtonGroup>
                                    <div className="mt-1">
                                        <ul className="list-unstyled">
                                            {seg.other_annotations
                                                ? Object.entries(seg.other_annotations).map(([key, value]) =>
                                                    <li style={{fontSize: "0.7rem"}} key={`annotator-${key}`}><span style={{ width: "2rem" }}>{key}: </span>{value}</li>
                                                )
                                                : ''}
                                        </ul>

                                    </div>
                                </div>
                            </ListGroup.Item>
                        )}
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
