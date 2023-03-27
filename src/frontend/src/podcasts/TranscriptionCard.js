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
function getSpeech2TxtRowsRecursive(myDict) {
    var rows = [];
    Object.keys(myDict).forEach(function(key, index) {
        if (typeof myDict[key] === 'object') {
            rows.push(getSpeech2TxtRowsRecursive(myDict[key]));
        } else {
            rows.push(<tr><th>{key}</th><td>{myDict[key].toString()}</td></tr>);
        }
    });
    return rows;
}


export default function TranscriptionCard({transcription}) {

  return (
      <Card>
        <Card.Header>Transcription {transcription.name}</Card.Header>
        <Card.Body>
          <Table striped bordered hover size="sm">
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
            <Link 
                variant="secondary"
                target='_blank'
                to={'/transcriptions/' + transcription.uuid}
            >
                <Button>View Transcript</Button>
            </Link>
            </Card.Body>

            {transcription.segmentation_set ? transcription.segmentation_set.map((seg) =>
            <>
                        <Card.Header>Segmentations</Card.Header>
                        <Card.Body>
                        <ListGroup as="ol">
                <ListGroup.Item
                key={seg.uuid}
                as="li"
                className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                    <div className="fw-bold">{seg.name}</div>
                    <ButtonGroup>
                    <Link  
                        variant="secondary"
                        target='_blank'
                        to={'/segmentations/' + seg.uuid}
                    ><Button >Segmentation</Button>
                    </Link >
                    <Link  
                        variant="secondary"
                        target='_blank'
                        to={'/annotations/' + seg.uuid}
                    ><Button>Annotation</Button></Link >
                    </ButtonGroup>
                    </div>
                    <Badge bg="primary" pill>
                    1
                    </Badge>
                    </ListGroup.Item>
                    </ListGroup>
        </Card.Body>
        </>
                ) : ""}

      </Card>
  );

}