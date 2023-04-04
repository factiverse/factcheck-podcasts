import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

export default function AudioPlayer({ url, utterance}) {
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current && utterance.start) {
      playerRef.current.seekTo(utterance.start, 'seconds');
    }
  }, [utterance.start]);

  return (
    <Card>
      <Card.Header>Audio Player</Card.Header>
      <Card.Body>
      <ReactPlayer
          ref={playerRef}
          url={url}
          controls={true}
          playing={false}
          width="100%"
          height="50px"
          config={{
            file: {
              attributes: {
                onContextMenu: e => e.preventDefault(),
              }
            }
          }}
        />
        <Form>
          <Form.Group className="mt-3">
            <Form.Label>Transcription</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={utterance.text}
              readOnly
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}
