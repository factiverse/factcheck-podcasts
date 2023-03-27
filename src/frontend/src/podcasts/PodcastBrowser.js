import React, { useEffect, useState } from 'react';
import './podcasts.css';
import ChannelListItem from './ChannelListItem';
import ChannelCard from './ChannelCard';
import axios from "axios";
import EpisodeCard from './EpisodeCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Col';
import { useParams } from "react-router-dom";
import ListGroup from 'react-bootstrap/ListGroup';

function PodcastBrowser({}) {
  const { podcastSlug, podcastGuid } = useParams();

  const [channels , setChannels] = useState([]);
  const [currentChannel , setCurrentChannel] = useState("");
  const [currentEpisode , setCurrentEpisode] = useState("");

  useEffect(() => {
    axios({
        method: "GET",
        url: "/api/podcasts/",
    }).then((response)=>{
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
  } ,[]);


	return (
      <Row>
        <Col>
          <aside className="bd-aside sticky-xl-top text-muted align-self-start mb-3 mb-xl-5 px-2">
            <nav className="small" id="toc">
              <ListGroup as="ul" className="list-unstyled">
              {channels.length > 0 ? channels.map((chan) =>
                <ChannelListItem  
                  channel={chan} 
                  setChan={setCurrentChannel} 
                  setItem={setCurrentEpisode}
                  key={"menu_"+chan.slug}
                  />): "loading"}
              </ListGroup>
            </nav>
          </aside>
        </Col>
        <Col>
          <Container>
            
            <ChannelCard channel={currentChannel} key={currentChannel.slug}/>
            {currentEpisode !== "" &&
              <EpisodeCard episode={currentEpisode} key={currentEpisode.guid} />
            }
          </Container>


        </Col>

      </Row>
	);
}

export default PodcastBrowser;