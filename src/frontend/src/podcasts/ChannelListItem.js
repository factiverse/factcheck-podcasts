import React, { useEffect, useState } from 'react';
import EpisodeListItem from './EpisodeListItem';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

export default function ChannelListItem({channel, setChan, setItem, active}) {


    const listItems = channel.audioitem_set.map((episode) =>
        <EpisodeListItem item={episode} channel={channel} setChan={setChan} setItem={setItem} key={"menu_"+episode.guid} />
    );

    return (
        <li className="my-2">
            <Link 
                className="btn d-inline-flex align-items-center collapsed border-0"
                variant="outline-primary"
                data-bs-toggle="collapse"
                data-bs-target= {"#" + channel.slug + "_collapselist"}
                aria-controls="forms-collapse"
                to={"/podcasts/" + channel.slug} 
                >{channel.title}
            </Link>
            <ListGroup as="ul" className={'list-unstyled ps-3 collapse'} id={channel.slug + "_collapselist"}>
                {listItems}
            </ListGroup>

        </li>
    );

}