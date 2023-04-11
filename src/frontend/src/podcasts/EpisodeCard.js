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
      <Card style={{ width: '18rem' }}>
        <Card.Header>
          <Card.Title>{episode.title}</Card.Title>
          <Card.Subtitle className="text-muted">{episode.subtitle}</Card.Subtitle>
        </Card.Header>
        <Card.Body className="d-inline-block">{truncateText(<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(episode.description ? episode.description : episode.summary) }} />)}</Card.Body>
      </Card>
    </>
  );

}
