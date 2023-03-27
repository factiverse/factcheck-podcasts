import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import EpisodeCard from './EpisodeCard';
import { secondsToHms } from '../util/time';
import Table from 'react-bootstrap/Table';

export default function TranscriptionViewer() {
  
  const { transcriptUuid } = useParams();
  const [transcript, setTranscript] = useState("");
  const [currentEpisode , setCurrentEpisode] = useState("");
  useEffect(() => {
    axios({
        method: "GET",
        url:"/api/transcriptions/" + transcriptUuid + "/",
      }).then((response)=>{
        const data = response.data;
        setTranscript(data);
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          }
      });
      } ,[]);

    // add transcript to the parent item's transcription set so it can be sent to the EpisodeCard
    useEffect(() => {
      if (transcript.item) {
        const episode = transcript.item;
        episode.transcription_set = [transcript];
        setCurrentEpisode(episode);
      }
    }, [transcript]);
//    

  return (
    <>
    {currentEpisode && <EpisodeCard episode={currentEpisode} />}

    {transcript.text && <textarea cols={100} rows={30}>{transcript.text}</textarea>}

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
        {transcript.json ? transcript.json.map((word) =>
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
    </>
  );

}