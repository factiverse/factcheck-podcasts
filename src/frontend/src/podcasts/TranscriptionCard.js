import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { LinkContainer } from 'react-router-bootstrap';

// recursive function to convert a dictionary to a collection of table rows,
// it checks if the value is a dictionary and calls itself if it is
// and also converts the value to a string
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

    return (
        <Card style={{ width: '20rem' }}>
            <Card.Header>Transcription {transcription.name}</Card.Header>
            <Card.Body>
                <Table striped bordered hover size="sm" responsive>
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
                <div className="d-flex justify-content-center">
                {!hideTranscriptionButton && <ButtonGroup>
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
            </Card.Body>
            <Card.Header>Segmentations</Card.Header>
            <Card.Body>

                <ListGroup as="ol">
                    {transcription.segmentation_set ? transcription.segmentation_set.map((seg) =>
                        <>

                            <ListGroup.Item
                                key={seg.uuid}
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
                                            Annotation
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </ListGroup.Item>
                        </>
                    ) : ""}

                </ListGroup>
            </Card.Body >
        </Card>
    );

}