import React, { useEffect, useRef, useState } from 'react';
import { secondsToHms } from '../../util/time';
import ReactPlayer from 'react-player/file';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import ClaimSpan from './ClaimSpan';
import { FaCheck, FaTimes, FaPlayCircle, FaPlus, FaMinus } from 'react-icons/fa';
import HelpPopUp from '../help/HelpPopUp';
import { helpPopUpData } from '../help/help';
import StringDiff from './StringDiff';

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
  const handleKeyDown = (event) => {
    if (event.code === 'Space' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA' && event.target.tagName !== 'BUTTON') {
      event.preventDefault();
      setAudioPlaying(!audioPlaying);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [utteranceContext]);

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
          <Card.Title>{isCheckworthy ? helpPopUpData["ClaimSpan"].cardTitle : "Statement"}</Card.Title>

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
                header={helpPopUpData["ClaimSpan"].helpHeader}
                text={helpPopUpData["ClaimSpan"].helpText}
                qualifier={"ClaimSpan"} />
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
        <Card.Title>{helpPopUpData["ClaimSpan"].cardInstructionHeader}</Card.Title>
        <Card.Text>{helpPopUpData["ClaimSpan"].cardInstructionBody}</Card.Text>
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
          <div className='me-2'>
            <Table className="table-striped">
              <tbody>
                {utteranceContext.map((contextUtterance) => {
                  return (
                    <tr key={contextUtterance.uuid + "test"}>
                      <td className="p-0 px-2">
                        <FaPlayCircle style={{ color: "green" }} onClick={() => { setPlayerTime(parseFloat(contextUtterance.start)); }} />
                      </td>
                      <td className="pt-1 pe-1" style={{fontSize: "0.8rem"}}>{secondsToHms(contextUtterance.start)}</td>
                      <td className="pt-1 pe-1" style={{fontSize: "0.8rem"}}>{secondsToHms(contextUtterance.end)}</td>
                      <td className="pt-1 pe-1" style={{fontSize: "0.8rem"}}>{contextUtterance.speaker}</td>
                      <td className="pt-1 pe-1 text-start">{contextUtterance.text}</td>
                    </tr>
                  );
                })}
                <tr className="table-primary">
                  <td className="p-0 px-2">
                    <FaPlayCircle style={{ color: "green" }} onClick={() => { setPlayerTime(parseFloat(utterance.start)); }} />
                  </td>
                  <td className="pt-1 pe-1" style={{fontSize: "0.8rem"}}>{secondsToHms(utterance.start)}</td>
                  <td className="pt-1 pe-1" style={{fontSize: "0.8rem"}}>{secondsToHms(utterance.end)}</td>
                  <td className="pt-1 pe-1" style={{fontSize: "0.8rem"}}>{utterance.speaker}</td>
                  <td className="pt-1 pe-1 text-start">{utterance.text}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>}
        <Card.Header>Automated Pronoun Resolution (accuracy not guaranteed)</Card.Header>
        {utterance.text_coref && <Card.Footer>
          <StringDiff stringA={utterance?.text} stringB={utterance?.text_coref} />
        </Card.Footer>}
    </Card>
  );
}
