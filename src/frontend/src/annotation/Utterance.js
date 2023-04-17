import React, { useEffect, useRef, useState } from 'react';
import { secondsToHms } from '../util/time';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


export default function Utterance({ url, utterance, utteranceContext }) {
  const playerRef = useRef(parseFloat(utterance.start));
  const [showContext, toggleContext] = useState(true);

  const handleKeyDown = (event) => {
    if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault();
      playerRef.current.getInternalPlayer().paused
        ? playerRef.current.getInternalPlayer().play()
        : playerRef.current.getInternalPlayer().pause();
    }
  };

  useEffect(() => {
    playerRef.current.seekTo(parseFloat(utterance.start));

        // Add keydown event listener
        window.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };

  }, [utterance]);

  const seekToTime = (time) => {
    playerRef.current.seekTo(parseFloat(time));
  };

  var i = 0;


  const renderRow = (rowUtterance, isHighlighted = false) => (
    <>
      <tr key={`${rowUtterance.start}-${rowUtterance.end}-${i++}`} className={isHighlighted ? '' : 'text-muted'}>
        <td>{secondsToHms(rowUtterance.start)}</td>
        <td>{secondsToHms(rowUtterance.end)}</td>
        <td>{rowUtterance.speaker}</td>
        <td>
          <Button onClick={() => seekToTime(rowUtterance.start)} variant="outline-success" size="sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
            <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
          </svg>
          </Button>
        </td>
        <td className="d-none d-sm-table-cell" style={{ textAlign: 'left', fontSize: isHighlighted ? "1.5em" : "1em" }}>
          {rowUtterance.text}
        </td>
      </tr>
      <tr className="d-sm-none">
        <td colSpan="5" style={{ textAlign: 'left', fontSize: isHighlighted ? "1.5em" : "1em" }}>
          {rowUtterance.text}
        </td>
      </tr>
    </>
  );

  return (
    <Card className='mb-3' style={{ minHeight: '25rem' }}>
      <Card.Body>
        <button
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            border: 'none',
            background: 'transparent',
            fontSize: '1.5em',
            cursor: 'pointer',
          }}
          onClick={() => toggleContext(!showContext)}
        >
          {showContext ? '-' : '+'}
        </button>
        <Table>
          <tbody>
            {showContext && utteranceContext.map((contextUtterance) => renderRow(contextUtterance))}
            {renderRow(utterance, true)}
          </tbody>
        </Table>
      </Card.Body>

      <Card.Footer className="text-muted">
        <ReactPlayer
          ref={playerRef}
          url={axios.defaults.baseURL + url}
          controls={true}
          playing={false}
          width="100%"
          height="50px"
        />
      </Card.Footer>

    </Card>

  );
}
