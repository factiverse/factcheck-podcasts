import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const scrollRef = useRef(null);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  const handleKeyDown = (event) => {
    const { tagName } = event.target;
    const scrubValue = 0.5; // Change this value to scrub more or less time

    // Detect either regular Enter or numpad Enter
    if ((event.code === "Enter" || event.code === "NumpadEnter") && tagName.type !== 'text') {
      event.preventDefault();
      event.stopPropagation();
      setAudioPlaying(!audioPlaying);
    }

    // Detect Shift+LeftArrow to scrub backwards
    if (event.shiftKey && event.code === "ArrowLeft") {
      event.preventDefault();
      setPlayerTime((current) => Math.max(0, current - scrubValue));
    }

    // Detect Shift+RightArrow to scrub forwards
    if (event.shiftKey && event.code === "ArrowRight") {
      event.preventDefault();
      const duration = playerRef.current.getDuration();
      setPlayerTime((current) => Math.min(duration, current + scrubValue));
    }

    // Detect Shift+'+' to increase playback speed
    if (event.shiftKey && event.key === "+") {
      event.preventDefault();
      setPlaybackSpeed((current) => Math.min(2, current + 0.1));
    }

    // Detect Shift+'-' to decrease playback speed
    if (event.shiftKey && event.key === "-") {
      event.preventDefault();
      setPlaybackSpeed((current) => Math.max(0.5, current - 0.1));
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [utterance.uuid]);

  const playAudioSegment = (start, end, isFirst = false) => {
    const audioPlayingBefore = audioPlaying;
    if (playerRef.current) {
      playerRef.current.seekTo(start - 0.3, 'seconds');
      setAudioPlaying(true);

      const duration = (end - start + 0.6) * 1000; // Convert to milliseconds and add 1 second
      const timeoutId = setTimeout(() => {
        if (isFirst) {
          setAudioPlaying(false);
        } else {
          setAudioPlaying(audioPlayingBefore);
        }
      }, duration);

      return timeoutId; // return the timeoutId
    }
  };

  useEffect(() => {
    if (utterance) {
      const start = parseFloat(utterance.start);
      const end = parseFloat(utterance.end);
      const timeoutId = playAudioSegment(start, end, true);

      // Clear timeout if the component is unmounted or utterance changes
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [utterance.uuid, playerRef, setAudioPlaying]);

  useEffect(() => {
    utteranceContext.forEach(contextUtterance => {
      const start = parseFloat(contextUtterance.start);
      const end = parseFloat(contextUtterance.end);
      contextUtterance.playFromContext = () => {
        return playAudioSegment(start, end);
      };
    });
  }, [utteranceContext, playerRef, setAudioPlaying]);

  useEffect(() => {
    if (utterance) {
      setPlayerTime(parseFloat(utterance.start));
    }
  }, [utterance]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerTime, 'seconds');
    }
  }, [playerTime])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [audioPlaying]);


  return (
    <Card className='mb-3'>
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
          playbackRate={playbackSpeed} // use the playbackSpeed state here
        />
      </Card.Header>

      <Card.Body style={{ minHeight: "8rem" }}>

        <div className="d-flex flex-row mt-0 pt-0">
          <div className="p-0 pe-1">
            <FaPlayCircle style={{ color: "green" }} onClick={() => {
              playerRef.current.seekTo(parseFloat(utterance.start), 'seconds');
              setAudioPlaying(true);
            }} />
          </div>
          <div className="p-0 pe-1 text-muted">{secondsToHms(utterance.start)}</div>
          <div className="p-0 pe-1 text-muted">{secondsToHms(utterance.end)}</div>
          <div className="p-0 pe-1 text-muted">{utterance.speaker}</div>
        </div>
        {utterance &&
          <ClaimSpan
            utterance={utterance}
            setUtterance={setUtterance}
            agent={agent}
            isCheckworthy={isCheckworthy}
            classification={classification}
            setPlayerTime={setPlayerTime}
          >
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
                        <FaPlayCircle style={{ color: "green" }} onClick={contextUtterance.playFromContext} />
                      </td>
                      <td className="pt-1 pe-1" style={{ fontSize: "0.8rem" }}>{secondsToHms(contextUtterance.start)}</td>
                      <td className="pt-1 pe-1" style={{ fontSize: "0.8rem" }}>{secondsToHms(contextUtterance.end)}</td>
                      <td className="pt-1 pe-1" style={{ fontSize: "0.8rem" }}>{contextUtterance.speaker}</td>
                      <td className="pt-1 pe-1 text-start">{contextUtterance.text}</td>
                    </tr>
                  );
                })}
                <tr className="table-primary">
                  <td className="p-0 px-2">
                    <FaPlayCircle style={{ color: "green" }} onClick={() => {
                      playerRef.current.seekTo(parseFloat(utterance.start), 'seconds');
                      setAudioPlaying(true);
                    }} />
                  </td>
                  <td className="pt-1 pe-1" style={{ fontSize: "0.8rem" }}>{secondsToHms(utterance.start)}</td>
                  <td className="pt-1 pe-1" style={{ fontSize: "0.8rem" }}>{secondsToHms(utterance.end)}</td>
                  <td className="pt-1 pe-1" style={{ fontSize: "0.8rem" }}>{utterance.speaker}</td>
                  <td className="pt-1 pe-1 text-start">{utterance.text}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>}
      {utterance.text_coref &&
        <>
          <Card.Header>Automated Pronoun Resolution (accuracy not guaranteed)</Card.Header>
          <Card.Footer>
            <StringDiff stringA={utterance?.text} stringB={utterance?.text_coref} />
          </Card.Footer>
        </>
      }
    </Card>
  );
}
