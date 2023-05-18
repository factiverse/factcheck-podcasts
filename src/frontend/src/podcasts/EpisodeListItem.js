import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

export default function EpisodeListItem({ item, channel, setChan, setItem, currentEpisode, queryParams }) {
  function handleItemListClick() {
    setChan(channel);
    setItem(item);
  }
  // get the sum of all prolific annotations for this item, 
  // for every transcription loop through the segments and add up the prolific_annotations
  let prolific_annotations = 0;
  if (item.transcription_set) {
    for (const transcription of item.transcription_set) {
      for (const segment of transcription.segmentation_set) {
        prolific_annotations += segment.prolific_annotations;
      }
    }
  }
console.log("prolific_annotations", prolific_annotations)
  return (
    <li className="w-100">
      <Link
        className={`d-inline-flex align-items-center rounded text-decoration-none ${currentEpisode && currentEpisode.guid == item.guid ? 'active' : ''}`}
        to={{ pathname: "/podcasts/" + channel.slug + "/" + item.guid, search: queryParams.toString() }}
        onClick={handleItemListClick}
        style={{ maxWidth: '100%' }}
      >
        {prolific_annotations > 0 ? <Badge pill className='p-0 px-1 me-1' bg='warning' text='dark'>{prolific_annotations}</Badge> : ''}
        <span className="text-truncate">{item.title}</span>
      </Link>
    </li>
  );
}
