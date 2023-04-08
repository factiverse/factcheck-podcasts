import React from 'react';
import Card from 'react-bootstrap/Card';
import DOMPurify from 'dompurify';

export default function EpisodeCard({ episode }) {

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Header>

          <Card.Title>{episode.title}</Card.Title>
          <Card.Subtitle className="text-muted">{episode.subtitle}</Card.Subtitle>
        </Card.Header>
        <Card.Body>

          {
            episode.description ?
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(episode.description) }} /> :
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(episode.summary) }} />
          }
        </Card.Body>
      </Card>
    </>
  );

}
