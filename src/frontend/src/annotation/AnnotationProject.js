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

export default function AnnotationProject() {
  const [index, setIndex] = useState(0);
  const [showContext, setShowContext] = useState(false);
  const [segmentation, setSegmentation] = useState({ utterance_set: [] });
  const [utterance, setUtterance] = useState(segmentation.utterance_set[index]);
  const [agent, setAgent] = useState(null);
  const { segmentationUuid } = useParams();

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/segmentations/" + segmentationUuid + "/",
    }).then((response) => {
      const data = response.data;
      setSegmentation(data);
      setUtterance(data.utterance_set[index]);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }, []);


  function handleMoreClick() {
    setShowContext(!showContext);
  }

  return (
    <div className="container text-center">

      {!agent && <UserModal setAgent={setAgent} />}

      {segmentation.item && segmentation.channel &&
        <h4>{segmentation.item.title} - {segmentation.channel.title}</h4>
      }
      <button onClick={handleMoreClick} className="btn btn-primary btn-sm">
        {showContext ? 'Hide' : 'Show'} Context
      </button>

      {showContext && <div>{utterance.context.map(utt => <Utterance utterance={utt} />)} </div>}

      {utterance && <Utterance
        utterance={utterance}
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

      <NavigationButtons index={index} segmentation={segmentation} setIndex={setIndex} setUtterance={setUtterance} />

    </div>

  );
}
