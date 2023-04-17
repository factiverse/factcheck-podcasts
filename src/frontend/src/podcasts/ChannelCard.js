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

export default function ChannelCard({ channel }) {
  // function to truncate text if it longer then 100 characters
  // and add ellipsis

  return (
    <Card style={{ minWidth: '25rem' }}>
      <Card.Header>
        <Card.Title>{channel.title}</Card.Title>
        <Card.Subtitle className="text-muted">{channel.categories}</Card.Subtitle>
      </Card.Header>
      <Card.Body className="d-flex flex-column">
        {truncateText(<div className='flex-grow-1' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(channel.description) }} />)}
      </Card.Body>
      <Card.Footer className="text-muted">{channel.author}</Card.Footer>
      <Card.Img variant='bottom' src={channel.image}/>
    </Card>
  );
}