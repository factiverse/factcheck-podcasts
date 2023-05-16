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
    owner = models.TextField("owner", max_length=255, blank=True)
    categories = models.CharField("categories", max_length=4000)
    type = models.PositiveSmallIntegerField("type", default=1, choices=CHANNEL_TYPE_CHOICES)
    slug = AutoSlugField("slug", populate_from="title", unique="True")
    description = models.TextField("description", max_length=4000)
    explicit = models.PositiveSmallIntegerField("explicit", default=1, choices=EXPLICIT_CHOICES)
    study_category = models.CharField("study category", max_length=255, null=True)

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
    summary = models.CharField("summary", max_length=20000, null=True)
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
    rss_index = models.PositiveSmallIntegerField("rss index")
    audio_link = models.URLField("audio_link", max_length=1000, null=True)

class Transcription(models.Model):
    """
    Represents a transcription of an audio file.
    """
    item = models.ForeignKey(AudioItem, on_delete=models.CASCADE)
    uuid = UUIDField("uuid", unique=True)
    name = models.CharField("name", max_length=20)
    words = models.JSONField("words")
    diarization = models.JSONField("diarization", null=True)
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
    visibility = models.JSONField("list of visible task cards, or 0 = utterance hidden, 1 = show all tasks", null=True)
    segmentation = models.ForeignKey(Segmentation, on_delete=models.CASCADE)
    speaker = models.CharField("speaker", max_length=255, null=True)
    start = models.CharField("start time", max_length=20)
    end = models.CharField("end time", max_length=20)
    text = models.TextField("text")
    text_coref = models.TextField("coreferenced text", null=True)
    microfacts = models.JSONField("summarized text info", null=True)
    claimspan = models.JSONField("text span containing claim", null=True)

class AgentSession(models.Model):
    """
    Represents a session of a user
    """
    uuid = UUIDField("uuid", unique=True)
    segmentation = models.ForeignKey(Segmentation, on_delete=models.CASCADE)
    agent = models.CharField("agent", max_length=100)
    prolific_study = models.CharField("Prolific study id", max_length=100, null=True)
    prolific_session = models.CharField("Prolific session id", max_length=100, null=True)
    created = models.DateTimeField("created time")
    last_updated = models.DateTimeField("last updated time")
    survey = models.JSONField("user initial survey answers", null=True)
    diarization = models.JSONField("user diarization labels", null=True)
    finished = models.BooleanField("annotation submitted to prolific", default=False)

class Classification(models.Model):
    """
    Represents a classification of an utterance
    """
    uuid = UUIDField("uuid", unique=True)
    utterance = models.ForeignKey(Utterance, on_delete=models.CASCADE)
    qualifier = models.CharField("qualifier", max_length=255) # e.g. "Checkworthiness", "Motivation for Fact-Checking"
    category = models.CharField("category", max_length=255) # e.g. "Checkworthy", "Not Checkworthy"
    label = models.TextField("label", null=True) # e.g. "Predictions", "Cause and Effect" for "Checkworthiness" qualifier
    agent = models.CharField("agent", max_length=100)
    prolific_study = models.CharField("Prolific study id", max_length=100, null=True)
    prolific_session = models.CharField("Prolific session id", max_length=100, null=True)

class Query(models.Model):
    """
    Represents a query relevant to an utterance
    """
    uuid = UUIDField("uuid", unique=True)
    utterance = models.ForeignKey(Utterance, on_delete=models.CASCADE)
    query = models.CharField("query", max_length=1000)
    platform = models.CharField("platform", max_length=100, null=True)
    agent = models.CharField("agent", max_length=100)
    valid = models.BooleanField("valid", default=False)
    prolific_study = models.CharField("Prolific study id", max_length=100, null=True)
    prolific_session = models.CharField("Prolific session id", max_length=100, null=True)

class Document(models.Model):
    """
    Represents a document returned by a query and whether it supports the utterance
    """
    uuid = UUIDField("uuid", unique=True)
    query = models.ForeignKey(Query, on_delete=models.CASCADE)
    document = models.CharField("document", max_length=1000)
    supports = models.PositiveSmallIntegerField("supports", choices=SUPPORTS_CHOICES, null=True)
    comment = models.CharField("comment", max_length=1000, null=True)
    agent = models.CharField("agent", max_length=100)
    valid = models.BooleanField("valid", default=False)