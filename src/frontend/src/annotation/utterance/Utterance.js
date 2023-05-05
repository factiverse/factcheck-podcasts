import React, { useEffect, useRef, useState } from 'react';
import { secondsToHms } from '../../util/time';
import ReactPlayer from 'react-player/file';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ClaimSpan from './ClaimSpan';
import { FaCheck, FaTimes, FaPlayCircle, FaPlus, FaMinus } from 'react-icons/fa';
import HelpPopUp from '../help/HelpPopUp';


export default function Utterance({ url, utterance, setUtterance, utteranceContext, audioPlaying, setAudioPlaying, isCheckworthy, agent, classification }) {
  const playerRef = useRef(null);
  const [showContext, toggleContext] = useState(true);
  const [playerTime, setPlayerTime] = useState(0);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [utteranceContext]);

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

  return (
    <Card className='mb-2'>
      <Card.Header className='pb-0'>
        <div className='d-flex justify-content-between align-items-center'>
          <Card.Title>{isCheckworthy ? "Statement - Highlight Claim Span" : "Statement"}</Card.Title>

          {isCheckworthy &&
            <div className='pb-2'>
              {classification?.label.length > 0 ? (
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

      <Card.Body style={{ minHeight: "8rem" }}>
        {utterance &&
          <ClaimSpan
            utterance={utterance}
            setUtterance={setUtterance}
            agent={agent}
            isCheckworthy={isCheckworthy}
            classification={classification}>
          </ClaimSpan>}
      </Card.Body>


      {isCheckworthy && <Card.Body>
        <Card.Title>{"Highlight the part of the podcast statement above which you will be fact checking."}</Card.Title>
        <Card.Text>
          {"Sometimes a statement will contain more than one individual claim or will contain other filler words at the beginning or end of the statement. In these cases, you should only highlight the part of the statement that you will be fact checking, otherwise highlight all words of the statement if the entire statement is relevant for your fact check."}
        </Card.Text>
      </Card.Body>}

      <Card.Header className='pb-0'>
        <div className='d-flex justify-content-between align-items-center'>
          <div>
            <Card.Title className='text-muted m-0'>STATEMENT CONTEXT</Card.Title>
          </div>
          <div className='pb-2'>
            {showContext ? (
              <FaMinus onClick={() => toggleContext(!showContext)} />
            ) : (
              <FaPlus onClick={() => toggleContext(!showContext)} />
            )}

          </div>
        </div>
      </Card.Header>

      {showContext &&
        <Card.Body ref={scrollRef} className="overflow-scroll p-0" style={{ maxHeight: '20em', overflowX: 'hidden' }}>
          <div>
            <Table className="table-striped">
              <tbody>
                {utteranceContext.map((contextUtterance) => {
                  return (
                    <tr key={contextUtterance.uuid + "test"}>
                      <td className="p-0 px-2">
                        <FaPlayCircle style={{ color: "green" }} onClick={() => { setPlayerTime(parseFloat(contextUtterance.start)); }} />
                      </td>
                      <td className="p-0 pe-2">{secondsToHms(contextUtterance.start)}</td>
                      <td className="p-0 pe-2">{secondsToHms(contextUtterance.end)}</td>
                      <td className="p-0 pe-2">{contextUtterance.speaker}</td>
                      <td className="p-0 pe-2 text-start">{contextUtterance.text}</td>
                    </tr>
                  );
                })}
                <tr className="table-primary">
                  <td className="p-0 px-2">
                    <FaPlayCircle style={{ color: "green" }} onClick={() => { setPlayerTime(parseFloat(utterance.start)); }} />
                  </td>
                  <td className="p-0 pe-2">{secondsToHms(utterance.start)}</td>
                  <td className="p-0 pe-2">{secondsToHms(utterance.end)}</td>
                  <td className="p-0 pe-2">{utterance.speaker}</td>
                  <td className="p-0 pe-2 text-start">{utterance.text}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>}
    </Card>
  );
}
