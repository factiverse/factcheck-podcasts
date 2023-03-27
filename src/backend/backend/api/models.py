from django.db import models
from backend.utils.fields import UUIDField
from django_extensions.db.fields import AutoSlugField

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

SUPPORTS_CHOICES = (
    (1, "Refutes"),
    (2, "Not Relevant"),
    (3, "Supports"),
)

class AudioChannel(models.Model):
    """
    Represents a collection of audio files, such as a podcast.
    """
    uuid = UUIDField("uuid", unique=True)
    rss = models.URLField("rss", max_length=1000)
    title = models.CharField("title", max_length=255)
    link = models.URLField("link", max_length=1000, null=True)
    image = models.URLField("image", max_length=1000)
    language = models.CharField("language", max_length=5)
    copyright = models.CharField("title", max_length=255, null=True)
    subtitle = models.CharField("subtitle", max_length=4000, null=True)
    author = models.CharField("author", max_length=255)
    summary = models.CharField("summary", max_length=4000)
    description = models.TextField("description", max_length=4000)
    owner = models.EmailField("owner", blank=True)
    categories = models.CharField("categories", max_length=255)
    type = models.PositiveSmallIntegerField("type", default=1, choices=CHANNEL_TYPE_CHOICES)
    slug = AutoSlugField("slug", populate_from="title", unique="True")
    description = models.TextField("description", max_length=4000)
    explicit = models.PositiveSmallIntegerField("explicit", default=1, choices=EXPLICIT_CHOICES)

class AudioItem(models.Model):
    """
    Represents a single audio file, such as a podcast episode.
    """
    channel = models.ForeignKey(AudioChannel, on_delete=models.CASCADE)
    uuid = UUIDField("uuid", unique=True)
    title = models.CharField("title", max_length=255)
    subtitle = models.CharField("subtitle", max_length=10000, null=True)
    author = models.CharField("author", max_length=255, null=True)
    link = models.URLField("link", max_length=1000, null=True)
    summary = models.CharField("summary", max_length=10000, null=True)
    description = models.TextField("description", max_length=4000, null=True)
    image = models.URLField("image", max_length=1000, null=True)
    guid = models.CharField("guid", max_length=255)
    pub_date = models.DateTimeField("published", null=True, blank=True, editable=False)
    language = models.CharField("language", max_length=20, null=True)
    explicit = models.PositiveSmallIntegerField("explicit", default=1, choices=EXPLICIT_CHOICES, null=True)
    season = models.PositiveSmallIntegerField("season", null=True)
    episode_num = models.PositiveSmallIntegerField("episode number", null=True)
    episode_type = models.PositiveSmallIntegerField("episode type", default=1, choices=ITEM_TYPE_CHOICES, null=True)
    duration = models.CharField("duration", max_length=255, null=True)
    audio_link = models.URLField("audio_link", max_length=1000, null=True)

class Transcription(models.Model):
    """
    Represents a transcription of an audio file.
    """
    item = models.ForeignKey(AudioItem, on_delete=models.CASCADE)
    uuid = UUIDField("uuid", unique=True)
    name = models.CharField("name", max_length=20)
    json = models.JSONField("json")
    text = models.TextField("text")
    speech2txt = models.JSONField("speech to text model")
    runtime = models.DurationField("runtime")
    created = models.DateTimeField("created time")
    language = models.CharField("language", max_length=255)

class Segmentation(models.Model):
    """
    Represents a transcription with words grouped into utterances
    """
    uuid = UUIDField("uuid", unique=True)
    name = models.CharField("name", max_length=20)
    transcription = models.ForeignKey(Transcription, on_delete=models.CASCADE)
    segmentor = models.JSONField("word to utterance model")

class Utterance(models.Model):
    """
    Represents a single utterance
    """
    uuid = UUIDField("uuid", unique=True)
    segmentation = models.ForeignKey(Segmentation, on_delete=models.CASCADE)
    speaker = models.CharField("speaker", max_length=255, null=True)
    start = models.CharField("start time", max_length=20)
    end = models.CharField("end time", max_length=20)
    text = models.CharField("text", max_length=4000)
    text_coref = models.CharField("text", max_length=4000, null=True)
    summary = models.CharField("text", max_length=255, null=True)


class Classification(models.Model):
    """
    Represents a classification of an utterance
    """
    uuid = UUIDField("uuid", unique=True)
    utterance = models.ForeignKey(Utterance, on_delete=models.CASCADE)
    qualifier = models.CharField("qualifier", max_length=255)
    label = models.CharField("label", max_length=255)
    agent = models.CharField("agent", max_length=100)

class Query(models.Model):
    """
    Represents a query relevant to an utterance
    """
    uuid = UUIDField("uuid", unique=True)
    utterance = models.ForeignKey(Utterance, on_delete=models.CASCADE)
    query = models.CharField("query", max_length=500)
    platform = models.CharField("platform", max_length=100)
    agent = models.CharField("agent", max_length=100)

class Document(models.Model):
    """
    Represents a document returned by a query and whether it supports the utterance
    """
    uuid = UUIDField("uuid", unique=True)
    query = models.ForeignKey(Query, on_delete=models.CASCADE)
    document = models.CharField("document", max_length=500)
    supports = models.PositiveSmallIntegerField("supports", choices=SUPPORTS_CHOICES)
    comment = models.CharField("comment", max_length=500)
    agent = models.CharField("agent", max_length=100)