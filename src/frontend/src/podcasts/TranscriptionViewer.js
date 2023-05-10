import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import EpisodeCard from './EpisodeCard';
import { secondsToHms } from '../util/time';
import Table from 'react-bootstrap/Table';
import ChannelCard from './ChannelCard';
import TranscriptionCard from './TranscriptionCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

export default function TranscriptionViewer() {

  const { transcriptUuid } = useParams();
  const [transcript, setTranscript] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState("");
  const [currentChannel, setCurrentChannel] = useState("");
  let [searchParams, setSearchParams] = useSearchParams("");

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/transcriptions/" + transcriptUuid + "/",
    }).then((response) => {
      const data = response.data;
      setTranscript(data);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }, [transcriptUuid]);

  // add transcript to the parent item's transcription set so it can be sent to the EpisodeCard
  useEffect(() => {
    if (transcript.item) {
      const episode = transcript.item;
      episode.transcription_set = [transcript];
      setCurrentEpisode(episode);
      setCurrentChannel(episode.channel);
    }
  }, [transcript]);
  //    

  return (
    <Container>
      <Row className='mb-3'>

        {currentChannel &&
          <Col><ChannelCard channel={currentChannel} /></Col>
        }
        {currentEpisode &&
          <Col><EpisodeCard episode={currentEpisode} /></Col>
        }
        {transcript &&
          <Col><TranscriptionCard 
          queryParams={searchParams}
          transcription={transcript} 
          hideTranscriptionButton /></Col>
        }

      </Row>
      <Row className='mb-3'>
        {transcript.text && <textarea cols={100} rows={30} value={transcript.text}></textarea>}

      </Row>
      <Row className='mb-3'>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Speaker</th>
              <th>Word</th>
              <th>Probability</th>
            </tr>
          </thead>
          <tbody>
            {transcript.words ? transcript.words.map((word) =>
              <tr>
                <td>{secondsToHms(word.start)}</td>
                <td>{secondsToHms(word.end)}</td>
                <td>{word.speaker}</td>
                <td>{word.word}</td>
                <td>{word.probability}</td>
              </tr>
            ) : "loading..."}
          </tbody>

        </Table>
      </Row>
    </Container>
  );

}