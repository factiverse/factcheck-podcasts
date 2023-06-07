import React, { useState, useEffect, useRef } from 'react';
import Utterance from './utterance/Utterance';
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { checkworthyLabels, advertisingLabels, motivationLabels } from './data.js';
import NavigationButtons from './NavigationButtons';
import ExclusiveSelector from './ExclusiveSelector';
import FactCheck from './factcheck/FactCheck';
import TranscriptionCheck from './utterance/TranscriptionCheck';
import UserModal from './modal/UserModal';
import { useSwipeable } from 'react-swipeable';
import { Row, Col, Container } from "react-bootstrap";
import Masonry from 'react-masonry-css';
import './annotation.css';
import Diarization from './utterance/Diarization';
import { allQualifiers } from './data.js';

const qual_cw = "Checkworthiness";
const qual_ad = "Advertising";
const qual_fc = "Factcheck";
const qual_mot = "Motivation";
const qual_trans = "Transcription";
const qual_coref = "Coreference";
const qual_diar = "Diarization";

const numContextUtterances = 20;

const breakpointCols = {
  default: 3,
  2800: 3, // 2 columns for screens wider than 1100px.
  2200: 2, // 2 column for screens between 700px and 1100px.
  1400: 1, // 1 column for screens smaller than 500px.
};

export default function AnnotationProject() {
  const [indexUnfiltered, setIndexUnfiltered] = useState(0);
  const [index, setIndex] = useState(0);
  const [segmentationUnfiltered, setSegmentationUnfiltered] = useState({ utterance_set: [] });
  const [segmentation, setSegmentation] = useState({ utterance_set: [] });
  const [utterance, setUtterance] = useState(null);
  const [classifications, setClassifications] = useState(null);
  const [agent, setAgent] = useState(null);
  const [agentSession, setAgentSession] = useState(null);
  const [agentSessionUpdated, setAgentSessionUpdated] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isCheckworthyUtt, setIsCheckworthyUtt] = useState(false); // used to hide/show fact check window after statement is classified as checkworthy
  const { segmentationUuid } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [factCheckCount, setFactCheckCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0); // number of documents URLs that have been added
  const [isExpedited, setIsExpedited] = useState(false); // option to select defaults for faster annotation
  const transcriptionInputRef = useRef(null);

  // randomly select the indices of some utterances to be used as attention checks
  // select a minimum of one and otherwise about 0.2% of the utterances to be attention checks
  const [attentionCheckIndices, setAttentionCheckIndices] = useState(null);
  // get a random number between 0 and 1
  const randomNum = Math.random();

  const setAttentionCheckIndicesFunc = (numUtterances) => {
    const numAttentionChecks = 1 + Math.round(numUtterances * 0.0033) + Math.round(Math.random());
    const attentionCheckIndices = [];
    while (attentionCheckIndices.length < numAttentionChecks) {
      const randomIndex = Math.floor(Math.random() * numUtterances);
      if (!attentionCheckIndices.includes(randomIndex)) {
        attentionCheckIndices.push(randomIndex);
      }
    }
    setAttentionCheckIndices(attentionCheckIndices);
  }

  // constant that contains the array with unique strings of all the entries in the utterance.visibility
  // JSON field containing either the number 1 or an array for every utterance in segmentation.utterance_set. 
  //If any utterance has visibility=1, then short circuit and set active qualifiers to the allQualifiers array
  const [activeQualifiers, setActiveQualifiers] = useState(null);

  // initialize the agent session
  useEffect(() => {
    if (agent && activeQualifiers && segmentation.utterance_set.length > 0) {
      const existingSession = segmentation?.agentsession_set ? segmentation.agentsession_set[0] : null;

      let labelsObject = null;
      if (activeQualifiers.includes(qual_diar)) {
        if (!existingSession?.diarization) {
          let uniqueLabelsArray = segmentation.diarization.content.map(item => item.label)
            .filter((value, index, self) => self.indexOf(value) === index);
          labelsObject = uniqueLabelsArray.reduce((obj, label) => {
            obj[label] = '';
            return obj;
          }, {});
        } else {
          labelsObject = existingSession.diarization;
        }
      }

      const data = {
        uuid: segmentationUuid,
        agent: agent.PROLIFIC_PID,
        prolific_session: agent.SESSION_ID,
        prolific_study: agent.STUDY_ID,
        diarization: labelsObject,
        survey: existingSession?.survey,
        finished: existingSession?.finished ?? false,
      }
      setSegmentation(segmentation => ({ ...segmentation, agent_session: data }));  // update the segmentation object with the agent session
      setAgentSession(data);
      setAgentSessionUpdated(!agentSessionUpdated);
    }
  }, [agent, activeQualifiers]);

  // Listen for keydown events on the document, for shortcut keys
  useEffect(() => {
    const keyHandler = (event) => {
      const { tagName } = event.target;

      // Return if Ctrl is being pressed
      if (event.ctrlKey) {
        return;
      }

      //SHORT CUT KEYS
      if (event.target.type !== 'text' && tagName !== 'TEXTAREA') {
        if (activeQualifiers && activeQualifiers.includes(qual_trans)) {
          
          // get the transcription classification for the current utterance
          const trClass = utterance.classification_set.filter(cl => cl.qualifier == qual_trans)[0];

          // APPROVE EXISTING TRANSCRIPTION
          if (event.key === 'a' || event.key === 'A') {
            postClassification(utterance.uuid, qual_trans, 'Approve Original', '', agent);
          }
          // EDIT EXISTING TRANSCRIPTION
          else if (event.key === 'e' || event.key === 'E') {
            postClassification(utterance.uuid, qual_trans, 'Edit', trClass?.label ?? '', agent);
            transcriptionInputRef.current.focus();
          }
          // CONFIRM EDIT TRANSCRIPTION
          // check to see if the transcription is actually different from the original
          else if (event.key === 'c' || event.key === 'C') {
            if (trClass.label && trClass.label !== utterance.text) {
              postClassification(utterance.uuid, qual_trans, 'Confirm Edit', trClass.label, agent);
            } else {
              alert("First click EDIT to enable editing in the text box, the CONFIRM EDIT button will \
only work after changes have been made to the text in EDIT mode.");
              transcriptionInputRef.current.focus();
            }
          }
          // UNSURE TRANSCRIPTION
          else if (event.key === 'u' || event.key === 'U') {
            postClassification(utterance.uuid, qual_trans, 'Unsure', '', agent);
          }
          // CHECKWORTHY SHORTCUT KEYS ACTIVATED IF NO TRANSCRIPTION TASK
        } else if (activeQualifiers ?? activeQualifiers.includes(qual_cw)) {
          // MARK AS FACTUAL DESCRIPTIONS
          if (event.key === 'f' || event.key === 'F') {
            postClassification(utterance.uuid, qual_cw, 'Checkworthy', 'Factual Descriptions', agent);
          }
          // MARK AS QUOTATION
          if (event.key === 'q' || event.key === 'Q') {
            postClassification(utterance.uuid, qual_cw, 'Checkworthy', 'Quotation', agent);
          }
          // MARK AS NOT A CLAIM
          if (event.key === 'n' || event.key === 'N') {
            postClassification(utterance.uuid, qual_cw, 'Not Checkworthy', 'Not a Claim', agent);
          }
          // MARK AS BROADCAST DETAILS
          if (event.key === 'b' || event.key === 'B') {
            postClassification(utterance.uuid, qual_cw, 'Not Checkworthy', 'Broadcast Details', agent);
          }
          // MARK AS BROADCAST DETAILS
          if (event.key === 'e' || event.key === 'E') {
            postClassification(utterance.uuid, qual_cw, 'Not Checkworthy', 'Emotions and Opinions', agent);
          }
        }

        // MARK AS NOT ADVERTISING (if advertising id task is active at the same time as checkworthiness, then CW takes precedence)
        if (activeQualifiers.includes(qual_ad) && !activeQualifiers.includes(qual_cw) && (event.key === 'n' || event.key === 'N')) {
          postClassification(utterance.uuid, qual_ad, 'Not Advertising', 'Not Advertising', agent);
        }

        if (event.code === 'Space') {
          // if a button is focused, and the user presses the spacebar, click the button
          if (document.activeElement.tagName === 'LABEL') {
            document.activeElement.click();
          }
          else if (document.activeElement.tagName === 'INPUT') {
            let labelElement = document.querySelector(`label[for='${document.activeElement.id}']`);
            if (labelElement) {
              labelElement.click();
            }
          }
        }
      }
    };

    if (document.activeElement) {
      document.activeElement.blur();
    }
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('keydown', keyHandler);
    };
  }, [utterance]);

  // post a classification to the API, used by TranscriptionCheck and ExclusiveSelector
  const postClassification = (utt_uuid, qualifier, category, label, agent) => {
    axios.post('/api/classifications/' + utt_uuid + "/", {
      utterance: utt_uuid,
      qualifier,
      category,
      label,
      agent,
    })
      .then((response) => {
        // update the classifications list in the utterance with the new classification received back from the API
        var newClassificationSet = [...utterance.classification_set];
        const classificationIndex = newClassificationSet.findIndex((item) => item.qualifier === qualifier);
        if (classificationIndex !== -1) {
          newClassificationSet[classificationIndex] = response.data;
        } else {
          newClassificationSet.push(response.data);
        }
        setUtterance({ ...utterance, classification_set: newClassificationSet });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  // post to api to update the agent session when the agent session object is updated
  useEffect(() => {
    if (agentSession) {
      axios({
        method: "PUT",
        url: `/api/agentsession/${segmentation.uuid}/`,
        data: agentSession,
      }).then((response) => {

        const data = response.data;
        setAgentSession(data);
        const newSegmentation = { ...segmentation };
        newSegmentation.agent_session = data;
        setSegmentation(newSegmentation);
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    }
  }, [agentSessionUpdated]);

  useEffect(() => {
    if (segmentation?.utterance_set.length > 0) {
      // set the intial value of factCheckCount and documentCount by looping through
      // every utterance in the segmentation and counting the number of queries in utterance.query_set that are valid
      // and then for documents, count the number of valid documents in the document_set of each valid query
      let factCheckCount = 0;
      let documentCount = 0;
      segmentation.utterance_set.forEach((utt) => {
        utt.query_set.forEach((query) => {
          if (query.valid) {
            factCheckCount += 1;
            if (query.document_set) {
              query.document_set.forEach((doc) => {
                if (doc.valid) {
                  documentCount += 1;
                }
              });
            }
          }
        });
      });
      setFactCheckCount(factCheckCount);
      setDocumentCount(documentCount);
    }
  }, [segmentation]);
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
    if (agent) {
      axios({
        method: "GET",
        url: `/api/segmentations/${segmentationUuid}?PROLIFIC_PID=${agent.PROLIFIC_PID}${agent.STUDY_ID ? `&STUDY_ID=${agent.STUDY_ID}` : ''}${agent.SESSION_ID ? `&SESSION_ID=${agent.SESSION_ID}` : ''}`,
      }).then((response) => {
        const data = response.data;
        setSegmentationUnfiltered(data);
        let filteredData = { ...data };
        filteredData.utterance_set = filteredData.utterance_set.filter((utterance) => utterance.visibility != 0);
        setSegmentation(filteredData);
        setUtterance(filteredData.utterance_set[index]);
        setClassifications(filteredData.utterance_set[index].classification_set);
        let actQuals = filteredData.utterance_set.map((utt) => utt.visibility).flat().filter((value, index, self) => self.indexOf(value) === index);
        if (actQuals.includes(1)) {
          actQuals = allQualifiers;
        }
        setActiveQualifiers(actQuals);
        setAttentionCheckIndicesFunc(filteredData.utterance_set.length);

      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    }

  }, [agent]);

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
  }, [utterance, classifications]);


  // find and set the indexUnfiltered in segmentationUnfiltered based on the uuid of the utterance
  // and set the classifications set for this utterance
  useEffect(() => {
    if (utterance) {
      const idx = segmentationUnfiltered.utterance_set.findIndex((u) => u.uuid === utterance.uuid);
      setIndexUnfiltered(idx);

      // set classifications for the utterance
      setClassifications(utterance.classification_set);
    }
  }, [utterance]);

  // collect query params from url and set agent state
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
      if (searchParams.get("expedited")) {
        if (searchParams.get("expedited") === "true") {
          agent["expedited"] = searchParams.get("expedited");
          setIsExpedited(true);
        }
      }
      if (Object.keys(agent).length != 0) {
        setAgent(agent);
        setSearchParams(agent);
      }
    }
  }, [agent]);

  // when the utterance changes, but it's because it's been updated and not going to the next utterance(index doesn't change),
  // insert the updated utterance into the segmentation's utterance_set
  useEffect(() => {
    if (utterance && segmentation) {
      const storedUtterance = segmentation.utterance_set[index];
      // check that the object in storedUtterance has the same attributes and values and the object in utterance
      if (JSON.stringify(storedUtterance) !== JSON.stringify(utterance)) {
        const newUtteranceSet = segmentation.utterance_set.map((u) => {
          if (u.uuid === utterance.uuid) {
            return utterance;
          } else {
            return u;
          }
        });
        const newSegmentation = { ...segmentation };
        newSegmentation.utterance_set = newUtteranceSet;
        setSegmentation(newSegmentation);


      }
    }
  }, [utterance]);


  const renderItems = () => {
    if (!classifications || !utterance?.visibility) return null;
    return [
      (utterance.visibility === 1 || utterance.visibility.includes(qual_trans)) && (
        <div key={qual_trans}>
          <TranscriptionCheck
            agent={agent}
            key={segmentation.uuid + "-transcheck"}
            qualifier={"Transcription"}
            classification={classifications.filter((c) => c.qualifier === "Transcription")[0]}
            utterance={utterance}
            postToAPI={postClassification}
            transcriptionInputRef={transcriptionInputRef}
            isExpedited={isExpedited}
          />
        </div>
      ),
      (utterance.visibility === 1 || utterance.visibility.includes(qual_cw)) && (
        <div key={qual_cw}>
          <ExclusiveSelector
            qualifier={qual_cw}
            agent={agent}
            labels={checkworthyLabels}
            splitField="category"
            utterance={utterance}
            setUtterance={setUtterance}
            classification={
              classifications.filter((c) => c.qualifier === qual_cw)[0]
            }
            postToAPI={postClassification}
            isExpedited={isExpedited}
          />
        </div>
      ),
      (utterance.visibility === 1 || utterance.visibility.includes("Factcheck")) && isCheckworthyUtt && (
        <div key={qual_fc}>
          <FactCheck
            agent={agent}
            utterance={utterance}
            setUtterance={setUtterance}
          />
        </div>
      ),
      (utterance.visibility === 1 || utterance.visibility.includes(qual_mot)) && isCheckworthyUtt && (
        <div key={qual_mot}>
          <ExclusiveSelector
            qualifier={qual_mot}
            agent={agent}
            labels={motivationLabels}
            splitField="category"
            utterance={utterance}
            setUtterance={setUtterance}
            classification={
              classifications.filter((c) => c.qualifier === qual_mot)[0]
            }
            postToAPI={postClassification}
            isExpedited={isExpedited}
          />
        </div>
      ),
      (utterance.visibility === 1 || utterance.visibility.includes(qual_ad)) && (
        <div key={qual_ad}>
          <ExclusiveSelector
            qualifier={qual_ad}
            agent={agent}
            labels={advertisingLabels}
            splitField="category"
            utterance={utterance}
            setUtterance={setUtterance}
            classification={
              classifications.filter((c) => c.qualifier === qual_ad)[0]
            }
            postToAPI={postClassification}
            isExpedited={isExpedited}
          />
        </div>
      ),
      (utterance.visibility === 1 || utterance.visibility.includes(qual_diar)) && agentSession?.diarization && (
        <div key={qual_diar}>
          <Diarization
            qualifier={qual_diar}
            agent={agent}
            agentSession={agentSession}
            setAgentSession={setAgentSession}
            agentSessionUpdated={agentSessionUpdated}
            setAgentSessionUpdated={setAgentSessionUpdated}
          />
        </div>
      ),

    ];
  };



  return (
    <div {...handlers}>

      {!agent && <UserModal setAgent={setAgent} />}

      <Container fluid className="text-center">

        <NavigationButtons
          index={index}
          segmentation={segmentation}
          setIndex={setIndex}
          utterance={utterance}
          setUtterance={setUtterance}
          factCheckCount={factCheckCount}
          documentCount={documentCount}
          agentSession={agentSession}
          setAgentSession={setAgentSession}
          agentSessionUpdated={agentSessionUpdated}
          setAgentSessionUpdated={setAgentSessionUpdated}
          attentionCheckIndices={attentionCheckIndices}
        />

        {utterance && agent && classifications && (
          <Row>
            <Col sm={12} md={6} lg={6} xxl={4}>
              <Utterance
                key={segmentation.uuid + "-utterance"}
                utterance={utterance}
                setUtterance={setUtterance}
                utteranceContext={segmentationUnfiltered.utterance_set
                  .slice(indexUnfiltered - numContextUtterances > 0 ? indexUnfiltered - numContextUtterances : 0, indexUnfiltered)
                }
                url={segmentation.audio_file_link}
                setAudioPlaying={setAudioPlaying}
                audioPlaying={audioPlaying}
                isCheckworthy={isCheckworthyUtt}
                agent={agent}
                classification={classifications.filter((c) => c.qualifier === "ClaimSpan")[0]}
                isAttentionCheck={activeQualifiers.includes("Transcription") && attentionCheckIndices.includes(index)}
              />
            </Col>
            <Col sm={12} md={6} lg={6} xxl={8}>
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
