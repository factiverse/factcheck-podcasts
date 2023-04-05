import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import TranscriptionCard from './TranscriptionCard';


export default function EpisodeCard({episode}) {

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{episode.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{episode.subtitle}</Card.Subtitle>
          <Card.Text> {episode.description ? episode.description : episode.summary}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );

}
