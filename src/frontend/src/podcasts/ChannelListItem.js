import React, { useEffect, useState } from 'react';
import EpisodeListItem from './EpisodeListItem';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

export default function ChannelListItem({channel, setChan, setItem, currentEpisode, currentChannel, queryParams}) {
    function handleItemListClick() {
        setChan(channel);
        setItem("");
      }

    const listItems = channel.audioitem_set.sort((a, b) => b.rss_index - a.rss_index).map((episode) =>
        <EpisodeListItem 
        item={episode} 
        channel={channel} 
        setChan={setChan} 
        setItem={setItem} 
        key={"menu_"+episode.guid}
        currentEpisode={currentEpisode}
        queryParams={queryParams}
        />
    );

    return (
        <li className="my-2">
            <Link 
                className={`btn d-inline-flex align-items-center border-0 ${currentEpisode && currentEpisode.slug == channel.slug ? '' : 'collapsed'}`}
                variant="outline-primary"
                data-bs-toggle="collapse"
                data-bs-target= {"#" + channel.slug + "_collapselist"}
                aria-controls="forms-collapse"
                to={{ pathname: "/podcasts/" + channel.slug, search: queryParams.toString() }}
                onClick={handleItemListClick}
                >{channel.title}
            </Link>
            <ListGroup as="ul" className={`list-unstyled ps-3 collapse ${currentChannel && currentChannel.slug == channel.slug ? 'show' : ''}`} id={channel.slug + "_collapselist"}>
                {listItems}
            </ListGroup>

        </li>
    );

}