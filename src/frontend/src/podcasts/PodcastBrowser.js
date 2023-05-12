import React, { useEffect, useState } from 'react';
import './podcasts.css';
import ChannelListItem from './ChannelListItem';
import ChannelCard from './ChannelCard';
import axios from "axios";
import EpisodeCard from './EpisodeCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams, useSearchParams } from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';
import TranscriptionCard from './TranscriptionCard';


export default function PodcastBrowser({ }) {
  const { podcastSlug, podcastGuid } = useParams();
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState("");
  let [searchParams, setSearchParams] = useSearchParams("");

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/podcasts/",
    }).then((response) => {
      const chans = response.data;
      setChannels(chans);
      if (podcastSlug) {
        const channel = chans.find((chan) => chan.slug === podcastSlug);
        if (channel) {
          setCurrentChannel(channel);
          if (podcastGuid) {
            const episode = channel.audioitem_set.find((ep) => ep.guid === podcastGuid);
            if (episode) {
              setCurrentEpisode(episode);
            }
          }
        }
      }
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }, []);

  return (
    <Row className="h-100">
      <Col className="bg-light h-100" sm={4} >
        <aside className="bd-aside sticky-xl-top text-muted align-self-start mb-3 mb-xl-5 px-2">
          <nav className="small" id="toc">
            <ListGroup as="ul" className="list-unstyled">
              {channels.length > 0 ? channels.map((chan) =>
                <ChannelListItem
                  channel={chan}
                  setChan={setCurrentChannel}
                  setItem={setCurrentEpisode}
                  currentEpisode={currentEpisode}
                  currentChannel={currentChannel}
                  queryParams={searchParams}
                  key={"menu_" + chan.slug}
                />) : "loading"}
            </ListGroup>
          </nav>
        </aside>
      </Col>
      <Col className="flex-grow-1 h-100 sticky-top pe-4" sm={8}>
        <Row className="h-100 mt-3">

          {searchParams && currentEpisode !== "" && currentEpisode.transcription_set.length > 0 ? currentEpisode.transcription_set.map((trans) =>
            <Col className="mb-3"
              key={`transcard-${trans.uuid}`}>
              <TranscriptionCard
                queryParams={searchParams}
                transcription={trans} />
            </Col>
          ) : <div></div>}

          {currentEpisode !== "" &&
            <Col className="mb-3">
              <EpisodeCard
                episode={currentEpisode}
                key={`episodeCard-${currentEpisode.uuid}`}
              />
            </Col>
          }

          {currentChannel !== "" &&
            <Col className="mb-3">
              <ChannelCard
                channel={currentChannel}
                key={`channelCard-${currentChannel.slug}`} />
            </Col>
          }

        </Row>
      </Col>
    </Row>
  );
}

