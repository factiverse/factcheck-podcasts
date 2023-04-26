import React from 'react';
import Card from 'react-bootstrap/Card';
import DOMPurify from 'dompurify';

function truncateText(text) {
  if (text.length > 300) {
    return text.substring(0, 300) + "...";
  } else {
    return text;
  }
}

export default function EpisodeCard({ episode }) {

  return (
    <>
      <Card className='mw-20'>
        <Card.Header>
          <Card.Title>{episode.title}</Card.Title>
          <Card.Subtitle className="text-muted">{episode.subtitle}</Card.Subtitle>
        </Card.Header>
        <Card.Body className="d-flex flex-column">
          <div className="flex-grow-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(episode.description ? episode.description : episode.summary)) }} />
        </Card.Body>
      </Card>
    </>
  );
}