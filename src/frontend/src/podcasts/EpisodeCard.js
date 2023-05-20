import React from 'react';
import Card from 'react-bootstrap/Card';
import DOMPurify from 'dompurify';
import { secondsToHms } from '../util/time';

function truncateText(text) {
  if (text.length > 300) {
    return text.substring(0, 300) + "...";
  } else {
    return text;
  }
}

export default function EpisodeCard({ episode }) {

  return (
    <Card style={{minWidth: "20rem"}}>
      <Card.Header>
        <Card.Title>{episode.title}</Card.Title>
        <Card.Subtitle className="text-muted">{episode.subtitle}</Card.Subtitle>
        <em className='mb-0'>{secondsToHms(episode.audio_length)}</em>
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(episode.description ? episode.description : episode.summary)) }} />
      </Card.Body>
    </Card>
  );
}