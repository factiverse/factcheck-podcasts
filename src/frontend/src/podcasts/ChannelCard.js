import React from 'react';
import Card from 'react-bootstrap/Card';

export default function ChannelCard({ channel }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Header>

        <Card.Title>{channel.title}</Card.Title>
        <Card.Subtitle className="text-muted">{channel.categories}</Card.Subtitle>
      </Card.Header>
      <Card.Body className="d-inline-block text-truncate" style={{maxHeight: 1000}}>{channel.description}</Card.Body>
      <Card.Img variant='middle' src={channel.image} />
      <Card.Footer className="text-muted">{channel.author}</Card.Footer>
    </Card>


  );

}