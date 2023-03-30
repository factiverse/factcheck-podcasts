import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

export default function AudioPlayer({ url, start, transcript, onTranscriptChange }) {
  const [editedTranscript, setEditedTranscript] = useState(transcript);

  const handleTranscriptChange = (e) => {
    setEditedTranscript(e.target.value);
    if (onTranscriptChange) {
      onTranscriptChange(e.target.value);
    }
  };
  console.log(url)
  return (
    <Card>
      <Card.Header>Audio Player</Card.Header>
      <Card.Body>
        <ReactPlayer
          url={url}
          controls={true}
          playing={false}
          width="100%"
          height="50px"
          config={{
            file: {
              attributes: {
                onContextMenu: e => e.preventDefault(),
                controlsList: 'nodownload'
              }
            }
          }}
          onStart={() => {
            if (start) {
              this.seekTo(start);
            }
          }}
        />
        <Form>
          <Form.Group className="mt-3">
            <Form.Label>Transcription</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={editedTranscript}
              onChange={handleTranscriptChange}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}
