import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { secondsToHms } from '../util/time';

export default function EpisodeListItem({ item, channel, setChan, setItem, currentEpisode, queryParams }) {
  function handleItemListClick() {
    setChan(channel);
    setItem(item);
  }
  // get the sum of all toloka annotations for this item, 
  // for every transcription loop through the segments and add up the toloka_annotations
  let toloka_annotations = 0;
  if (item.transcription_set) {
    for (const transcription of item.transcription_set) {
      for (const segment of transcription.segmentation_set) {
        toloka_annotations += segment.toloka_annotations;
      }
    }
  }

  // get the sum of all other annotations for this episode, loop through each transcription 
  // in item.transcription_set, then loop through the transcription.segmentation_set to view the 
  // segment.other_annotations object and add the value of each key to the sum
  // any agent where the key contains "ClaimBuster" should be excluded
  let other_annotations = 0;
  if (item.transcription_set) {
    for (const transcription of item.transcription_set) {
      for (const segment of transcription.segmentation_set) {
        for (const key in segment.other_annotations) {
          if (!key.includes("ClaimBuster") && !key.includes("Factiverse")) {
            other_annotations += segment.other_annotations[key];
          }
        }
      }
    }
  }

  return (

    <li>
      <div className='d-flex align-items-center justify-content-between'>
        <Link
          className={`rounded text-decoration-none text-truncate ${currentEpisode && currentEpisode.guid == item.guid ? 'active' : ''}`}
          to={{ pathname: "/podcasts/" + channel.slug + "/" + item.guid, search: queryParams.toString() }}
          onClick={handleItemListClick}
        >
          {item.title}

        </Link>
        <div style={{ minWidth: "25%" }} className='d-flex align-items-center justify-content-end'>
          <Badge
            pill
            className='p-0 px-1 me-1'
            style={{ opacity: "50%" }}
            bg={"danger"}>
            {other_annotations > 0 ? other_annotations : ''}
          </Badge>
          {toloka_annotations > 0 ?
            <Badge
              pill
              className='p-0 px-1 me-1'
              bg='warning'
              text='dark'
              style={{ opacity: "50%" }}
            >
              {toloka_annotations}
            </Badge> : ''}
          <Badge
            pill
            className='p-0 px-1 me-1'
            style={{ opacity: "50%" }}
            bg={"secondary"}>
            {secondsToHms(item.audio_length)}
          </Badge>
        </div>
      </div>
    </li>
  );


}
