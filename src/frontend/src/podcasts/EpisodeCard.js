import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import TranscriptionCard from './TranscriptionCard';


export default function EpisodeCard({episode}) {

  return (
    <CardGroup>
      <Card>
        <Card.Body>
          <Card.Title>Episode INFO {episode.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body>
      </Card>
      {episode.transcription_set.length > 0 ? episode.transcription_set.map((trans) =>
        <TranscriptionCard 
          transcription={trans} 
          key={trans.uuid} />
      ): <div>loading</div>}
    </CardGroup>
  );

}
