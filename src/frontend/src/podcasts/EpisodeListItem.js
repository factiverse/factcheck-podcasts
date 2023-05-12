import React from 'react';
import { Link } from 'react-router-dom';

export default function EpisodeListItem({ item, channel, setChan, setItem, currentEpisode, queryParams }) {
  function handleItemListClick() {
    setChan(channel);
    setItem(item);
  }

  return (
    <li className="w-100">
      <Link
        className={`d-inline-flex align-items-center rounded text-decoration-none ${currentEpisode && currentEpisode.guid == item.guid ? 'active' : ''}`}
        to={{ pathname: "/podcasts/" + channel.slug + "/" + item.guid, search: queryParams.toString() }}
        onClick={handleItemListClick}
        style={{ maxWidth: '100%' }}
      >
        <span className="text-truncate">{item.title}</span>
      </Link>
    </li>
  );
}
