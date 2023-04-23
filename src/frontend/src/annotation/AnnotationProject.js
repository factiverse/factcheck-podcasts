import React, { useState, useEffect } from 'react';
import Utterance from './Utterance';
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { checkworthyLabels, advertisingLabels } from './data.js';
import NavigationButtons from './NavigationButtons';
import ExclusiveSelector from './ExclusiveSelector';
import FactCheck from './FactCheck';
import TranscriptionCheck from './TranscriptionCheck';
import UserModal from './UserModal';
import { useSwipeable } from 'react-swipeable';
import Container from 'react-bootstrap/Container';
import Alert from "react-bootstrap/Alert";
import Masonry from 'react-masonry-css';
import './annotation.css';


const numContextUtterances = 4;

const breakpointCols = {
  default: 4, // The default number of columns.
  1100: 5, // 3 columns for screens wider than 1100px.
  700: 3, // 2 column for screens between 700px and 1100px.
  500: 2, // 1 column for screens smaller than 500px.
};

export default function AnnotationProject() {
  const [indexUnfiltered, setIndexUnfiltered] = useState(0);
  const [index, setIndex] = useState(0);
  const [segmentationUnfiltered, setSegmentationUnfiltered] = useState({ utterance_set: [] });
  const [segmentation, setSegmentation] = useState({ utterance_set: [] });
  const [utterance, setUtterance] = useState(null);
  const [agent, setAgent] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { segmentationUuid } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();

  const swipeConfig = { delta: 100 };
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (eventData.dir === "Left" && index + 1 < segmentation.utterance_set.length - 1) {
        setIndex(index + 1);
        setUtterance(segmentation.utterance_set[index + 1]);
      } else if (eventData.dir === "Right" && index > 0) {
        setIndex(index - 1);
        setUtterance(segmentation.utterance_set[index - 1]);
      }
    },
    onTap: (event) => {
      // make sure the tap is not on a button
      if (event.event.target.tagName !== 'BUTTON') {
        setAudioPlaying(!audioPlaying);
      }
    },
    ...swipeConfig
  });

  // get the segmentation set from API, including the utterance set that will be cycled through
  // TODO filter by agent
  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/segmentations/" + segmentationUuid + "/",
    }).then((response) => {
      const data = response.data;
      setSegmentationUnfiltered(data);
      let filteredData = { ...data };
      filteredData.utterance_set = filteredData.utterance_set.filter((utterance) => utterance.hidden === false);
      setSegmentation(filteredData);
      setUtterance(filteredData.utterance_set[index]);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }, []);

  // find and set the indexUnfiltered in segmentationUnfiltered based on the uuid of the utterance
  useEffect(() => {
    if (utterance) {
      const idx = segmentationUnfiltered.utterance_set.findIndex((u) => u.uuid === utterance.uuid);
      setIndexUnfiltered(idx);
    }
  }, [utterance]);

  useEffect(() => {
    if (searchParams.get("PROLIFIC_PID")) {
      setAgent(searchParams.get("PROLIFIC_PID"));
    } else {
      if (agent) {
        setSearchParams({ PROLIFIC_PID: agent })
      }
    }
  }, [agent]);

  const items = [
    <div key="utterance">
      <Utterance
        utterance={utterance}
        utteranceContext={segmentationUnfiltered.utterance_set
          .slice(
            indexUnfiltered - numContextUtterances > 0
              ? indexUnfiltered - numContextUtterances
              : 0,
            indexUnfiltered
          )
          .reverse()}
        url={segmentation.audio_file_link}
        setAudioPlaying={setAudioPlaying}
        audioPlaying={audioPlaying}
      />
    </div>,
    <div key="checkworthiness">
      <ExclusiveSelector
        qualifier="Checkworthiness"
        agent={agent}
        labels={checkworthyLabels}
        splitField="category"
        utterance={utterance}
      />
    </div>,
    <div key="advertising">
      <ExclusiveSelector
        qualifier="Identify Advertising"
        agent={agent}
        labels={advertisingLabels}
        splitField="category"
        utterance={utterance}
      />
    </div>,
    <div key="fact-check">
      <FactCheck agent={agent} utterance={utterance} />
    </div>,
    <div key="transcription-check">
      <TranscriptionCheck
        agent={agent}
        key={segmentation.uuid + "-transcheck"}
        utterance={utterance}
      />
    </div>,
  ];


  return (
    <div {...handlers}>
      <Container fluid className="text-center">
        {segmentation.item && segmentation.channel &&
        
          <Alert variant="secondary" className='p-0 mt-2 mb-2'>
            <div class="d-flex justify-content-between align-items-center">
              <div className='p-2 pb-0 overflow-hidden'><p className='h3 text-truncate text-uppercase'>{segmentation.channel.title}</p></div>
              <div className="p-2 pb-0 overflow-hidden"><p className='h4 text-truncate text-muted'>{segmentation.item.title}</p></div>
            </div>
          </Alert>
        }

        {!agent && <UserModal setAgent={setAgent} />}

        <NavigationButtons
          index={index}
          segmentation={segmentation}
          setIndex={setIndex}
          setUtterance={setUtterance}
        />

        {utterance && agent && (
          <Masonry
            breakpointCols={breakpointCols}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {items.map((item) => item)}
          </Masonry>
        )}


      </Container>
    </div>
  );
}
