import React, { useEffect, useRef, useState } from 'react';
import { secondsToHms } from '../../util/time';
import ReactPlayer from 'react-player/file';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import ClaimSpan from './ClaimSpan';
import { FaCheck, FaTimes } from 'react-icons/fa';
import HelpPopUp from '../help/HelpPopUp';


export default function Utterance({ url, utterance, utteranceContext, audioPlaying, setAudioPlaying, isCheckworthy }) {
  const playerRef = useRef(null);
  const [showContext, toggleContext] = useState(true);
  const [playerTime, setPlayerTime] = useState(0);

  const handleKeyDown = (event) => {
    if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && event.target.tagName !== 'BUTTON') {
      event.preventDefault();
      setAudioPlaying(!audioPlaying);
    }
  };

  useEffect(() => {
    if (utterance) {
      setPlayerTime(parseFloat(utterance.start));
    }
  }, [utterance])

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerTime, 'seconds');
    }
  }, [playerTime])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [audioPlaying]);

  var i = 0;
  const renderRow = (rowUtterance, isHighlighted = false) => (
    <React.Fragment key={rowUtterance.uuid}>
      <tr className="info-row" id={`${rowUtterance.uuid}-${i}-text`}>
        <td colSpan="5" style={{ textAlign: 'left', fontSize: isHighlighted ? "1.5em" : "1em" }}>
          {isHighlighted ? <ClaimSpan utterance={rowUtterance} /> : rowUtterance.text}
        </td>
      </tr>
      <tr id={`${rowUtterance.uuid}-${i++}-extra`} className={`p-0 m-0 border-bottom ${isHighlighted ? '' : 'text-muted'}`}>
        <td>
          <Badge pill onClick={() => { setPlayerTime(parseFloat(rowUtterance.start)); setAudioPlaying(true); }} bg="success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play p-0 m-0" viewBox="0 0 16 16">
              <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
            </svg>
          </Badge>
        </td>
        <td>{secondsToHms(rowUtterance.start)}</td>
        <td>{secondsToHms(rowUtterance.end)}</td>
        <td>{rowUtterance.speaker}</td>
      </tr>
    </React.Fragment>
  );

  return (
    <Card style={{ minHeight: '25rem', backgroundColor: "#f8f9fa" }} className='mb-2'>
      <Card.Header className='pb-0'>
        <div className='d-flex justify-content-between align-items-center'>
          <Card.Title>{isCheckworthy ? "Statement - Highlight Claim Span" : "Statement"}</Card.Title>

          {isCheckworthy &&
            <div className='pb-2'>
              {false ? (
                <span style={{ color: 'green', marginRight: '5px' }}>
                  <FaCheck />
                </span>
              ) : (
                <span style={{ color: 'red', marginRight: '5px' }}>
                  <FaTimes />
                </span>
              )}
              <HelpPopUp
                header={"helpHeader"}
                text={"helpText"}
                qualifier={"qualifier"} />
            </div>}
        </div>
      </Card.Header>
      <Card.Header>
        <ReactPlayer
          ref={playerRef}
          url={axios.defaults.baseURL + url}
          controls={true}
          playing={audioPlaying}
          width="100%"
          height="2em"
        />
      </Card.Header>

      {/* }
      <Card.Header className="text-muted d-flex pt-0">
      <div className="float-right" style={{ width: "5%" }}>
          <button
            className="btn"
            style={{
              fontSize: "2em",
              cursor: "pointer",
              color: "black",
            }}
            onClick={() => toggleContext(!showContext)}
          >
            {showContext ? "-" : "+"}
          </button>
        </div>
        <div style={{ width: "95%" }}>
          <ReactPlayer
            ref={playerRef}
            url={axios.defaults.baseURL + url}
            controls={true}
            playing={audioPlaying}
            width="100%"
            height="50%"
          />
        </div>

      </Card.Header>
          {*/}

      <Card.Body>

        {utterance && utterance.claimspan && <ClaimSpan utterance={utterance}></ClaimSpan>}
        <Table size='sm' className='table-borderless'>
          <tbody>
            {renderRow(utterance, true)}
            {showContext && utteranceContext.map((contextUtterance) => renderRow(contextUtterance))}
          </tbody>
        </Table>

      </Card.Body>
      <Card.Footer>
        {utterance && <ClaimSpan utterance={utterance}></ClaimSpan>}
      </Card.Footer>

    </Card>
  );
}
