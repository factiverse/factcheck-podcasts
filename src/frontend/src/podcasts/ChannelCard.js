import React from 'react';
import Card from 'react-bootstrap/Card';

export default function ChannelCard({ channel }) {
  // function to truncate text if it longer then 100 characters
  // and add ellipsis

  function truncateText(text) {
    if (text.length > 300) {
      return text.substring(0, 300) + "...";
    } else {
      return text;
    }
  }


  return (
    <Card style={{ width: '18rem' }}>
      <Card.Header>

        <Card.Title>{channel.title}</Card.Title>
        <Card.Subtitle className="text-muted">{channel.categories}</Card.Subtitle>
      </Card.Header>
      <Card.Body className="d-inline-block">{truncateText(channel.description)}</Card.Body>
      <Card.Img variant='middle' src={channel.image} />
      <Card.Footer className="text-muted">{channel.author}</Card.Footer>
    </Card>


  );

}