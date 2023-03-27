from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChannelSerializerGet, ChannelSerializerPost, ItemSerializerGet, TranscriptionSerializer, SegmentationSerializer, QuerySerializer, ClassificationSerializer
from .models import AudioChannel, AudioItem, Transcription, Segmentation, Utterance, Classification, Query, Document
from ..utils.pod_parser import parse_channel

class AudioChannelApiView(APIView):

    # List all without including the child items
    def get(self, request, *args, **kwargs):
        channels = AudioChannel.objects
        serializer = ChannelSerializerGet(channels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # post new rss link, then parse the rss, serialize and save to db
    def post(self, request, *args, **kwargs):
        rss = request.data['rss']
        # Parse the RSS feed and return the data
        data = parse_channel(rss)
        serializer = ChannelSerializerPost(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AudioItemApiView(APIView):

    # List items for a given channel
    def get(self, request, *args, **kwargs):
        '''
        List all the todo items for given requested user
        '''
        item = AudioItem.objects.filter(channel__slug=kwargs['slug'])
        serializer = ItemSerializerGet(item, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TranscriptionApiView(APIView):

    def get(self, request, *args, **kwargs):
        transcript = Transcription.objects.filter(uuid=kwargs['uuid']).first()
        serializer = TranscriptionSerializer(transcript)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request, *args, **kwargs):
        guid = request.data['guid']
        speech2txt = request.data['speech2txt']
        runtime = request.data['runtime']
        created = request.data['created']
        item = AudioItem.objects.filter(guid=guid).first()
        transcript = request.data['json']
        text = request.data['text']
        language = request.data['language']
        name = request.data['name']
        serializer = TranscriptionSerializer(data={'item': item.id, 'json': transcript, 'speech2txt': speech2txt, 'runtime': runtime, 'created': created, 'text': text, 'language': language, 'name': name})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# post segmentations of a transcript    
class UtteranceApiView(APIView):

    def post(self, request, *args, **kwargs):
        transcript = Transcription.objects.filter(uuid=request.data['uuid']).first()
        serializer = SegmentationSerializer(data={'transcription': transcript.id, 'segmentor': request.data['segmentor'], 'utterance_set': request.data['utterance_set'], 'name': request.data['name']})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# get segmentations of a transcript
class SegmentationApiView(APIView):

    def get(self, request, *args, **kwargs):
        # return all utterance sets for a given channel and item
        seg = Segmentation.objects.filter(uuid=kwargs['uuid']).first()
        serializer = SegmentationSerializer(seg)
        return Response(serializer.data, status=status.HTTP_200_OK)

# post classifications from the annotation interface
class ClassificationApiView(APIView):

    # post from radio button, old entry for user must be deleted
    # same should apply if e.g. applying claimbuster labels, only one per agent/qualifier
    def post(self, request, *args, **kwargs):
        utterance = Utterance.objects.filter(uuid=request.data['utterance']).first()
        # delete old entry for user
        Classification.objects.filter(utterance=utterance, qualifier=request.data['qualifier'], agent=request.data['agent']).delete()

        serializer = ClassificationSerializer(data={
            'utterance': utterance.id,
            'qualifier': request.data['qualifier'],
            'label': request.data['label'],
            'agent': request.data['agent'],
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        utterance = Utterance.objects.filter(uuid=kwargs['uuid']).first()
        classifications = Classification.objects.filter(utterance=utterance)
        serializer = ClassificationSerializer(classifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# post queries and documents from the annotation interface
# get a list of queries (and documents) for a given utterance for annotation interface
class QueryApiView(APIView):
    
        def post(self, request, *args, **kwargs):
            utterance = Utterance.objects.filter(uuid=request.data['utterance']).first()
            serializer = QuerySerializer(data={
                'utterance': utterance.id,
                'qualifier': request.data['qualifier'],
                'label': request.data['label'],
                'agent': request.data['agent'],
            })
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
    
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        def get(self, request, *args, **kwargs):
            utterance = Utterance.objects.filter(uuid=kwargs['uuid']).first()
            queries = Query.objects.filter(utterance=utterance)
            serializer = QuerySerializer(queries, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
