import React, { useState, useEffect } from 'react';
import Utterance from './Utterance';
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { checkworthyLabels, advertisingLabels, motivationLabels } from './data.js';
import NavigationButtons from './NavigationButtons';
import ExclusiveSelector from './ExclusiveSelector';
import FactCheck from './FactCheck';
import TranscriptionCheck from './TranscriptionCheck';
import UserModal from './UserModal';
import { useSwipeable } from 'react-swipeable';
import { Row, Col, Alert, Container } from "react-bootstrap";
import Masonry from 'react-masonry-css';
import './annotation.css';
const numContextUtterances = 4;

const breakpointCols = {
  default: 4, // The default number of columns.
  2500: 3, // 3 columns for screens wider than 1500px.
  1900: 2, // 2 columns for screens wider than 1100px.
  1000: 1, // 2 column for screens between 700px and 1100px.
  500: 1, // 1 column for screens smaller than 500px.
};

export default function AnnotationProject() {
  const [indexUnfiltered, setIndexUnfiltered] = useState(0);
  const [index, setIndex] = useState(0);
  const [segmentationUnfiltered, setSegmentationUnfiltered] = useState({ utterance_set: [] });
  const [segmentation, setSegmentation] = useState({ utterance_set: [] });
  const [utterance, setUtterance] = useState(null);
  const [classifications, setClassifications] = useState(null);
  const [agent, setAgent] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isCheckworthyUtt, setIsCheckworthyUtt] = useState(false);
  const [annotationComplete, setAnnotationComplete] = useState({});
  const { segmentationUuid } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();

  // function to get the classification set for the current utterance from the api
  const getClassifications = () => {
    axios({
      method: "GET",
      url: `/api/classifications/${utterance.uuid}?PROLIFIC_PID=${agent.PROLIFIC_PID}${agent.STUDY_ID ? `&STUDY_ID=${agent.STUDY_ID}` : ''}${agent.SESSION_ID ? `&SESSION_ID=${agent.SESSION_ID}` : ''}`,
    }).then((response) => {
      const data = response.data;
      setClassifications(data);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  };

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
    //onTap: (event) => {
    // make sure the tap is not on a button
    //  if (event.event.target.tagName !== 'BUTTON') {
    //    setAudioPlaying(!audioPlaying);
    //  }
    //},
    ...swipeConfig
  });

  // get the segmentation set from API, including the utterance set that will be cycled through
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

  // check if the classification set has a checkworthy classification and set isCheckworthyUtt (FOR SHOW/HIDE FACT CHECK)
  useEffect(() => {
    const checkForCheckworthyClassification = () => {
      if (classifications) {
        const checkworthyClassification = classifications.filter((c) => c.qualifier === "Checkworthiness" && c.category === "Checkworthy")[0];
        if (checkworthyClassification) {
          return true;
        }
      }
      return false;
    };
    const checkworthyExists = checkForCheckworthyClassification();
    setIsCheckworthyUtt(checkworthyExists);
  }, [JSON.stringify(classifications)]);

  // get the classification for the current utterance
  useEffect(() => {
    if (utterance && agent) {
      getClassifications();
    }
  }, [utterance, agent]);

  // find and set the indexUnfiltered in segmentationUnfiltered based on the uuid of the utterance
  useEffect(() => {
    if (utterance) {
      const idx = segmentationUnfiltered.utterance_set.findIndex((u) => u.uuid === utterance.uuid);
      setIndexUnfiltered(idx);
    }
  }, [utterance]);

  useEffect(() => {
    if (agent) {
      setSearchParams(agent)
    } else {
      let agent = {};
      if (searchParams.get("PROLIFIC_PID")) {
        agent["PROLIFIC_PID"] = searchParams.get("PROLIFIC_PID");
      }
      if (searchParams.get("STUDY_ID")) {
        agent["STUDY_ID"] = searchParams.get("STUDY_ID");
      }
      if (searchParams.get("SESSION_ID")) {
        agent["SESSION_ID"] = searchParams.get("SESSION_ID");
      }
      if (Object.keys(agent).length != 0) {
        setAgent(agent);
        setSearchParams(agent);
      }
    }
  }, [agent]);

  const renderItems = () => {
    if (!classifications) return null;

    return [
      <div key="checkworthiness">
        <ExclusiveSelector
          qualifier="Checkworthiness"
          agent={agent}
          labels={checkworthyLabels}
          splitField="category"
          utterance={utterance}
          classification={classifications.filter((c) => c.qualifier === "Checkworthiness")[0]}
          updateFunction={getClassifications}
          annotationComplete={annotationComplete}
          setAnnotationComplete={setAnnotationComplete}
        />
      </div>,
      isCheckworthyUtt && <div key="fact-check">
        <FactCheck agent={agent} utterance={utterance} />
      </div>,
      <div key="motivation">
        <ExclusiveSelector
          qualifier="Motivations"
          agent={agent}
          labels={motivationLabels}
          splitField="category"
          utterance={utterance}
          classification={classifications.filter((c) => c.qualifier === "Motivations")[0]}
          updateFunction={getClassifications}
          annotationComplete={annotationComplete}
          setAnnotationComplete={setAnnotationComplete}
        />
      </div>,
      <div key="advertising">
        <ExclusiveSelector
          qualifier="Advertising"
          agent={agent}
          labels={advertisingLabels}
          splitField="category"
          utterance={utterance}
          classification={classifications.filter((c) => c.qualifier === "Advertising")[0]}
          updateFunction={getClassifications}
          annotationComplete={annotationComplete}
          setAnnotationComplete={setAnnotationComplete}
        />
      </div>,
    ];
  };


  return (
    <div {...handlers}>

      {!agent && <UserModal setAgent={setAgent} />}

      <Container fluid className="text-center">
        {segmentation.item && segmentation.channel &&
          <Alert variant="secondary" className='p-0 mt-2 mb-2'>
            <div className="d-flex justify-content-between align-items-center">
              <div className='p-2 pb-0 overflow-hidden w-50'><p className='h3 text-truncate text-uppercase'>{segmentation.channel.title}</p></div>
              <div className="p-2 pb-0 overflow-hidden"><p className='h4 text-truncate text-muted'>{segmentation.item.title}</p></div>
            </div>
          </Alert>
        }
        <NavigationButtons
          index={index}
          segmentation={segmentation}
          setIndex={setIndex}
          setUtterance={setUtterance}
          annotationComplete={annotationComplete}
        />

        {utterance && agent && classifications && (
          <Row>
            <Col xs={12} lg={6} xxl={4}>
              <Utterance
                key={segmentation.uuid + "-utterance"}
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
              <TranscriptionCheck
                agent={agent}
                key={segmentation.uuid + "-transcheck"}
                qualifier={"Transcription"}
                classification={classifications.filter((c) => c.qualifier === "Transcription")[0]}
                utterance={utterance}
                annotationComplete={annotationComplete}
                setAnnotationComplete={setAnnotationComplete}
              />
            </Col>
            <Col>
              <Masonry
                breakpointCols={breakpointCols}
                className="masonry-grid"
                columnClassName="masonry-grid_column"
              >
                {renderItems()}
              </Masonry>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}
