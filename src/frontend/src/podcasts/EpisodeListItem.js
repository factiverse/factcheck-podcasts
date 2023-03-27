import React from 'react';
import { Link } from 'react-router-dom';

export default function EpisodeListItem({item, channel, setChan, setItem}) {
  function handleItemListClick() {
    setChan(channel);
    setItem(item);
  }
  
  return (
    <li>
          <Link 
            className="d-inline-flex align-items-center rounded text-decoration-none" 
            to={"/podcasts/"+channel.slug+"/"+item.guid} 
            onClick={handleItemListClick}
            >{item.title}</Link>
    </li>
  );

}