from rest_framework import serializers
from .models import AudioChannel, AudioItem, Transcription, Utterance, Segmentation, Classification, Query, Document, AgentSession


class AgentSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgentSession
        fields = [
            'uuid',
            'agent',
            'prolific_study',
            'prolific_session',
            'created',
            'last_updated',
            'survey',
            'diarization',
            'segmentation',
            'finished'
        ]

# class to serialize documents associated with queries
class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            'document',
            'supports',
            'comment',
            'valid',
            'uuid'
        ]


# class to serialize queries
class QuerySerializer(serializers.ModelSerializer):
    document_set = DocumentSerializer(many=True)

    class Meta:
        model = Query
        fields = [
            'utterance',
            'query',
            'platform',
            'agent',
            'uuid',
            'document_set',
            'valid',
            'prolific_session',
            'prolific_study',
        ]

    def create(self, validated_data):
        documents_data = validated_data.pop('document_set')
        query = Query.objects.create(**validated_data)
        for doc in documents_data:
            Document.objects.create(query=query, **doc)
        return query


# class to serialize classifications for a given utterance
# will be read/wrote by Annotation interface,
# and wrote to by data population notebook (e.g. to add Claimbuster labels)
class ClassificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classification
        fields = [
            'utterance',
            'qualifier',
            'label',
            'category',
            'agent',
            'prolific_session',
            'prolific_study',
            'uuid',
        ]

    def create(self, validated_data):
        classification = Classification.objects.create(**validated_data)
        return classification

# read in annotation interface and segmentation view, wrote by utterance updater
class UtteranceSerializer(serializers.ModelSerializer):
    classification_set = ClassificationSerializer(many=True, required=False)
    query_set = QuerySerializer(many=True, required=False)

    class Meta:
        model = Utterance
        fields = [
            'visibility',
            'start',
            'end',
            'speaker',
            'text',
            'text_coref',
            'microfacts',
            'claimspan',
            'uuid',
            'classification_set',
            'query_set'
        ]

# read in annotation interface and segmentation view, wrote by utterance updater
class UtteranceSerializerSimple(serializers.ModelSerializer):
    class Meta:
        model = Utterance
        fields = [
            'visibility',
            'start',
            'end',
            'speaker',
            'text',
            'text_coref',
            'microfacts',
            'claimspan',
            'uuid',
        ]


# read by segmentation viewer, wrote by data population notebook
class SegmentationSerializer(serializers.ModelSerializer):
    utterance_set = UtteranceSerializer(many=True)
    audio_file_link = serializers.SerializerMethodField()
    item = serializers.SerializerMethodField()
    channel = serializers.SerializerMethodField()
    diarization = serializers.SerializerMethodField()
    agent_session = serializers.SerializerMethodField()

    class Meta:
        model = Segmentation
        fields = [
            'transcription',
            'uuid',
            'name',
            'segmentor',
            'utterance_set',
            'audio_file_link',
            'item',
            'channel', 
            'diarization',
            'agent_session',
            ]

    def create(self, validated_data):
        utterances_data = validated_data.pop('utterance_set')
        segmentation = Segmentation.objects.create(**validated_data)
        for utterance_data in utterances_data:
            # utterance_data without classification_set and query_set
            filt_utt_data = {k: v for k, v in utterance_data.items() if k not in ['classification_set', 'query_set']}
            newUtt = Utterance.objects.create(segmentation=segmentation, **filt_utt_data)
            if 'classification_set' in utterance_data:
                for classification_data in utterance_data.pop('classification_set'):
                    classification_data['utterance'] = newUtt  # Update the utterance value in the dictionary
                    Classification.objects.create(**classification_data)
            if 'query_set' in utterance_data:
                for query_data in utterance_data.pop('query_set'):
                    query_data['utterance'] = newUtt  # Update the utterance value in the dictionary
                    Query.objects.create(**query_data)
        return segmentation

    def get_audio_file_link(self, obj):
        return f"media/{obj.transcription.item.channel.slug}_{obj.transcription.item.guid}.mp3"

    def get_item(self, obj):
        return ItemSerializerGet(obj.transcription.item).data

    def get_channel(self, obj):
        return ChannelSerializerGet(obj.transcription.item.channel).data
    
    def get_diarization(self, obj):
        return obj.transcription.diarization
    
    def get_agent_session(self, obj):
        sess = AgentSession.objects.filter(segmentation=obj.id).first()
        return AgentSessionSerializer(sess).data


# return details of the segmentation without including the text data


class SegmentationSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Segmentation
        fields = [
            'transcription',
            'uuid',
            'name',
            'segmentor'
        ]


class TranscriptionSerializer(serializers.ModelSerializer):
    segmentation_set = SegmentationSummarySerializer(many=True)

    class Meta:
        model = Transcription
        fields = [
            'item',
            'words',
            'diarization',
            'name',
            'text',
            'speech2txt',
            'runtime',
            'created',
            'language',
            'uuid',
            'segmentation_set']
        depth = 2


class TranscriptionPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcription
        fields = [
            'item',
            'words',
            'diarization',
            'name',
            'text',
            'speech2txt',
            'runtime',
            'created',
            'language',
            'uuid'
        ]

# return details of the transcription without including the text data


class TranscriptionSummarySerializer(serializers.ModelSerializer):
    segmentation_set = SegmentationSummarySerializer(many=True)

    class Meta:
        model = Transcription
        fields = [
            'item', 
            'speech2txt', 
            'runtime', 
            'created',
            'language', 
            'uuid', 
            'segmentation_set'
            ]


class ItemSerializerGet(serializers.ModelSerializer):
    transcription_set = TranscriptionSummarySerializer(many=True)

    class Meta:
        model = AudioItem
        fields = [
            "title",
            "subtitle",
            "author",
            "link",
            "summary",
            "description",
            "image",
            "guid", 
            "pub_date",
            "language", 
            "explicit", 
            "season", 
            "episode_num", 
            "episode_type", 
            "duration", 
            "audio_link", 
            "rss_index",
            "transcription_set"
            ]


class ItemSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = AudioItem
        fields = [
            "channel",
            "title", 
            "subtitle", 
            "author", 
            "link", 
            "summary", 
            "description", 
            "image", 
            "guid", 
            "pub_date",
            "language", 
            "explicit", 
            "season", 
            "episode_num", 
            "episode_type", 
            "duration", 
            "audio_link",
            "rss_index",
            ]


class ChannelSerializerPost(serializers.ModelSerializer):
    audioitem_set = ItemSerializerPost(many=True)

    class Meta:
        model = AudioChannel
        fields = [
            'rss', 
            'title', 
            'link', 
            'image', 
            'language', 
            'copyright', 
            'subtitle', 
            'slug', 
            'author',
            'summary', 
            'description', 
            'owner', 
            'categories', 
            'type', 
            'description', 
            'explicit',
            'audioitem_set'
            ]

    def create(self, validated_data):
        items_data = validated_data.pop('audioitem_set')
        channel = AudioChannel.objects.create(**validated_data)
        for item_data in items_data:
            AudioItem.objects.create(channel=channel, **item_data)
        return channel


class ChannelSerializerGet(serializers.ModelSerializer):
    audioitem_set = ItemSerializerGet(many=True)

    class Meta:
        model = AudioChannel
        fields = [
            'rss', 
            'title', 
            'link', 
            'image', 
            'language', 
            'copyright', 
            'subtitle', 
            'slug', 
            'author',
            'summary', 
            'description', 
            'owner', 
            'categories', 
            'type', 
            'description', 
            'explicit',
            'study_category',
            'audioitem_set'
            ]


class ItemTranscriptionSerializer(serializers.ModelSerializer):
    transcription_set = TranscriptionSerializer(many=True)

    class Meta:
        model = AudioItem
        fields = ["title", "subtitle", "author", "link", "summary", "description", "image", "guid", "pub_date",
                  "language", "explicit", "season", "episode_num", "episode_type", "duration", "audio_link", "transcription_set"]
