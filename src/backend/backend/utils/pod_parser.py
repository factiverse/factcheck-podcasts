import feedparser
from django.template.defaultfilters import slugify 

"""
Parse the RSS feed and return a dictionary of data which the Django model can use to create a new instance.

"""
EXPLICIT_CHOICES = (
    (1, "yes"), 
    (2, "no"), 
    (3, "clean")
)

CHANNEL_TYPE_CHOICES = (
    (1, "episodic"), 
    (2, "serial")
)

ITEM_TYPE_CHOICES = (
    (1, "full"), 
    (2, "trailer"),
    (3, "bonus"),
)

explicit_dict = dict((choice[1], choice[0])for choice in EXPLICIT_CHOICES)
channel_type_dict = dict((choice[1], choice[0])for choice in CHANNEL_TYPE_CHOICES)
item_type_dict = dict((choice[1], choice[0])for choice in ITEM_TYPE_CHOICES)

def parse_channel(rss, num_episodes):
    """
    Parses an RSS feed and returns a dictionary of channel data.
    """
    feed = feedparser.parse(rss)
    print(feed.feed.publisher_detail)
    channel_data = {
        "rss": rss,
        "title": feed.feed.title,
        "image": feed.feed.image.href,
        "language": feed.feed.language,
        "summary": feed.feed.summary,
        "description": feed.feed.description,
        "owner": feed.feed.publisher_detail.get("email", feed.feed.publisher_detail.get("name")),
        "categories": ", ".join([cat.term for cat in feed.feed.tags]),
        "description": feed.feed.description,
    }

    if "link" in feed.feed.keys():
        channel_data["link"] = feed.feed.link

    if "subtitle" in feed.feed.keys() and len(feed.feed.subtitle) > 0:
        channel_data["subtitle"] = feed.feed.subtitle

    if "copyright" in feed.feed.keys():
        channel_data["copyright"] = feed.feed.copyright

    if "author" in feed.feed.keys():
        channel_data["author"] = feed.feed.author

    if "itunes_type" in feed.feed.keys():
        channel_data["type"] = channel_type_dict.get(feed.feed.itunes_type.lower())

    if "itunes_explicit" in feed.feed.keys():
        if feed.feed.itunes_explicit:
            channel_data["explicit"] = explicit_dict.get("yes")
        else:
            channel_data["explicit"] = explicit_dict.get("no")

    episodes = []
    last_idx = num_episodes if num_episodes else -1
    for entry in feed.entries[0: last_idx]:
        episode = {
            "title": entry.title,
            "guid": slugify(entry.guid),
            "pub_date": entry.published,
            "audio_link": next(item for item in entry.links if item["rel"] == "enclosure")["href"],
        }

        if "itunes_duration" in entry.keys():
            episode["duration"] = entry.itunes_duration

        if "author" in entry.keys():
            episode["author"] = entry.author

        if "itunes_episodetype" in entry.keys():
            episode["episode_type"] = item_type_dict.get(entry.itunes_episodetype.lower())

        if "summary" in entry.keys() and len(entry.summary) > 0:
            episode["summary"] = entry.summary

        if "description" in entry.keys() and len(entry.description) > 0:
            episode["description"] = entry.description

        if "subtitle" in entry.keys() and len(entry.subtitle) > 0:
            episode["subtitle"] = entry.subtitle

        if "link" in entry.keys() and len(entry.link) > 0:
            episode["link"] = entry.link

        if "itunes_episode" in entry.keys():
            episode["episode_num"] = entry.itunes_episode

        if "itunes_explicit" in entry.keys():
            if entry.itunes_explicit:
                episode["explicit"] = explicit_dict.get("yes")
            else:
                episode["explicit"] = explicit_dict.get("no")

        if "image" in entry.keys():
            episode["image"] = entry.image.href

        if "itunes_season" in entry.keys():
            episode["season"] = entry.itunes_season

        
        episodes.append(episode)

    channel_data["audioitem_set"] = episodes

    return channel_data