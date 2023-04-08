import React, { useEffect, useRef } from 'react';
import { secondsToHms } from '../util/time';
import ReactPlayer from 'react-player';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';


export default function Utterance({ url, utterance }) {
  const playerRef = useRef(parseFloat(utterance.start));

  useEffect(() => {
    playerRef.current.seekTo(parseFloat(utterance.start));
  }, [utterance]);

  return (
    <Card className='mb-3' style={{ minHeight: '18rem' }}>
      <Card.Body>
        <Table>
          <tbody>
            <tr>
              <td>{utterance && secondsToHms(utterance.start)}</td>
              <td>{utterance && secondsToHms(utterance.end)}</td>
              <td>{utterance && utterance.speaker}</td>
              <th>{utterance && utterance.text} </th>
            </tr>
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