import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export default function AudioPlayer({ url, utterance}) {
  const playerRef = useRef(parseFloat(utterance.start));

  useEffect(() => {
      playerRef.current.seekTo(parseFloat(utterance.start));
  }, [utterance]);

  return (
    <Card>
      <Card.Header><Card.Title>Audio Player</Card.Title></Card.Header>
      <Card.Body>
        <ReactPlayer
          ref={playerRef}
          url={axios.defaults.baseURL + url}
          controls={true}
          playing={false}
          width="100%"
          height="50px"
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
