import React from 'react';
import EpisodeListItem from './EpisodeListItem';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

export default function ChannelListItem({ channel, setChan, setItem, currentEpisode, currentChannel, queryParams }) {
    let lang = channel.language.substring(0, 2);
    lang = lang == 'nb' ? 'no' : lang;

    // get the sum of all prolific annotations for this channel, loop through channel.audioitem_set 
    // for each transcription in audioitem.transcription_set loop through the segments and add up the prolific_annotations
    let prolific_annotations = 0;
    for (const item of channel.audioitem_set) {
        if (item.transcription_set) {
            for (const transcription of item.transcription_set) {
                for (const segment of transcription.segmentation_set) {
                    prolific_annotations += segment.prolific_annotations;
                }
            }
        }
    }

    // get the sum of all other annotations for this channel, loop through channel.audioitem_set 
    // for each transcription in audioitem.transcription_set loop through the segments to view the 
    // segment.other_annotations object and add the value of each key to the sum
    // any agent where the key contains "ClaimBuster" should be excluded
    let other_annotations = 0;
    for (const item of channel.audioitem_set) {
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
    }

    

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
            key={"menu_" + episode.guid}
            currentEpisode={currentEpisode}
            queryParams={queryParams}
        />
    );

    return (
        <li className="my-2">
            <div className='d-flex align-items-center justify-content-between'>
                <Link
                    className={`btn border-0 text-truncate ${currentEpisode && currentEpisode.slug == channel.slug ? '' : 'collapsed'}`}
                    variant="outline-primary"
                    data-bs-toggle="collapse"
                    data-bs-target={"#" + channel.slug + "_collapselist"}
                    aria-controls="forms-collapse"
                    to={{ pathname: "/podcasts/" + channel.slug, search: queryParams.toString() }}
                    onClick={handleItemListClick}
                >{channel.title}
                </Link>
                <div style={{minWidth: "25%"}} className='d-flex align-items-center justify-content-end'>
                    <Badge
                        pill
                        className='p-0 px-1 me-1'
                        style={{opacity: "50%"}}
                        bg={"danger"}>
                        {other_annotations > 0 ? other_annotations : ''}
                    </Badge>
                    <Badge
                        pill
                        className='p-0 px-1 me-1'
                        style={{opacity: "50%"}}
                        text='dark'
                        bg={"warning"}>
                        {prolific_annotations > 0 ? 'Prolific:' + prolific_annotations : ''}
                    </Badge>
                    <Badge
                        pill
                        className='text-uppercase p-0 px-1 me-1'
                        bg={lang == "en" ? "primary" : lang == "no" ? "info" : lang == "de" ? "secondary" : "light"}
                        text={lang == "sv" || lang == "da" ? "dark" : ""}>
                        {lang}
                    </Badge>
                    <Badge
                        pill
                        className='p-0 px-1 me-1'
                        bg={channel.study_category == "politics" ? "dark" : "success"}>
                        {channel.study_category == "politics" ? "N/P" : "H/W"}
                    </Badge>
                </div>
            </div>
            <ListGroup as="ul" className={`list-unstyled ps-3 collapse ${currentChannel && currentChannel.slug == channel.slug ? 'show' : ''}`} id={channel.slug + "_collapselist"}>
                {listItems}
            </ListGroup>

        </li>
    );

}