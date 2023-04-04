import React from 'react';
import { Link } from 'react-router-dom';

export default function EpisodeListItem({item, channel, setChan, setItem}) {
  function handleItemListClick() {
    setChan(channel);
    setItem(item);
  }

// function to truncate text if it longer then 100 characters
// and add ellipsis

  function truncateText(text) {
    if (text.length > 50) {
      return text.substring(0, 50) + "...";
    } else {
      return text;
    }
  }

  return (
    <li>
          <Link 
            className="d-inline-flex align-items-center rounded text-decoration-none " 
            to={"/podcasts/"+channel.slug+"/"+item.guid} 
            onClick={handleItemListClick}
            >{truncateText(item.title)}</Link>
    </li>
  );

}