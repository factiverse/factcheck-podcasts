import React, { useState, useEffect } from 'react';
import Utterance from './Utterance';
import axios from "axios";
import { useParams } from "react-router-dom";
import { checkworthyLabels, advertisingLabels } from './data.js';
import NavigationButtons from './NavigationButtons';
import ExclusiveSelector from './ExclusiveSelector';
import FactCheck from './FactCheck';
import CardGroup from 'react-bootstrap/CardGroup';
import TranscriptionCheck from './TranscriptionCheck';
import UserModal from './UserModal';

const numContextUtterances = 4;

export default function AnnotationProject() {
  const [indexUnfiltered, setIndexUnfiltered] = useState(0);
  const [index, setIndex] = useState(0);
  const [segmentationUnfiltered, setSegmentationUnfiltered] = useState({ utterance_set: [] });
  const [segmentation, setSegmentation] = useState({ utterance_set: [] });
  const [utterance, setUtterance] = useState(null);
  const [agent, setAgent] = useState(null);
  const { segmentationUuid } = useParams();

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

  return (
    <div className="container text-center">

      {!agent && <UserModal setAgent={setAgent} />}

      {segmentation.item && segmentation.channel &&
        <h4>{segmentation.item.title} - {segmentation.channel.title}</h4>
      }

      {utterance && <Utterance
        utterance={utterance}
        utteranceContext={segmentationUnfiltered.utterance_set.slice(
          indexUnfiltered - numContextUtterances > 0 ? indexUnfiltered - numContextUtterances : 0, indexUnfiltered
        )}
        url={segmentation.audio_file_link}
      />}

      {utterance && agent && (
        <CardGroup>
          <ExclusiveSelector
            qualifier="Checkworthiness"
            agent={agent}
            labels={checkworthyLabels}
            splitField="category"
            utterance={utterance}
          />

          <ExclusiveSelector
            qualifier="Advertising"
            agent={agent}
            labels={advertisingLabels}
            splitField="category"
            utterance={utterance}
          />

          <FactCheck
            agent={agent}
            utterance={utterance}
          />

          <TranscriptionCheck
            agent={agent}
            key={segmentation.uuid + "-transcheck"}
            utterance={utterance}
          />
        </CardGroup>
      )}

      <NavigationButtons
        index={index}
        segmentation={segmentation}
        setIndex={setIndex}
        setUtterance={setUtterance}
      />

    </div>

  );
}
