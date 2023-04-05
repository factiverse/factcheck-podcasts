from django.shortcuts import render
from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from .serializers import ChannelSerializerGet, ChannelSerializerPost, TranscriptionSerializer, SegmentationSerializer, QuerySerializer, ClassificationSerializer, DocumentSerializer, TranscriptionPostSerializer
from .models import AudioChannel, AudioItem, Transcription, Segmentation, Utterance, Classification, Query, Document
from ..utils.pod_parser import parse_channel
import os

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
        data = parse_channel(rss, 10)
        serializer = ChannelSerializerPost(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class MediaFileView(APIView):
    def get(self, request, path, *args, **kwargs):
        file_path = os.path.join(settings.MEDIA_ROOT, path)
        print("!!!",settings.MEDIA_ROOT)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), content_type='audio/mpeg')
        else:
            raise Http404("File not found")

class TranscriptionApiView(APIView):

    def get(self, request, *args, **kwargs):
        transcript = Transcription.objects.filter(uuid=kwargs['uuid']).first()
        serializer = TranscriptionSerializer(transcript)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request, *args, **kwargs):
        guid = request.data['guid']
        item = AudioItem.objects.filter(guid=guid).first()
        serializer = TranscriptionPostSerializer(data={
            'item': item.id, 
            'words': request.data['words'], 
            'speech2txt': request.data['speech2txt'], 
            'runtime': request.data['runtime'], 
            'created': request.data['created'], 
            'text': request.data['text'], 
            'language': request.data['language'], 
            'name': request.data['name'],
            'diarization': request.data['diarization']
            })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# post segmentations of a transcript    
class UtteranceApiView(APIView):

    def post(self, request, *args, **kwargs):
        transcript = Transcription.objects.filter(uuid=request.data['uuid']).first()
        serializer = SegmentationSerializer(data={
            'transcription': transcript.id, 
            'segmentor': request.data['segmentor'], 
            'utterance_set': request.data['utterance_set'], 
            'name': request.data['name']})
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
        Classification.objects.filter(utterance=utterance, qualifier=request.data['qualifier'], category=request.data['category'], agent=request.data['agent']).delete()

        serializer = ClassificationSerializer(data={
            'utterance': utterance.id,
            'qualifier': request.data['qualifier'],
            'category': request.data['category'],
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
        utterance = Utterance.objects.filter(uuid=kwargs['uuid']).first()
        print(utterance.id, kwargs['uuid'])
        created_queries = []

        # Delete existing records for the user
        agent = request.data[0]['agent']
        Query.objects.filter(agent=agent, utterance=utterance).delete()


        for query_data in request.data:
            print(query_data)
            # Deserialize the document_set using the DocumentSerializer
            document_set_data = query_data['document_set']
            document_serializer = DocumentSerializer(data=document_set_data, many=True)

            # Validate the document_set data
            if not document_serializer.is_valid():
                raise ValidationError(document_serializer.errors)

            serializer = QuerySerializer(data={
                'utterance': utterance.id,
                'agent': query_data['agent'],
                'query': query_data['query'],
                'platform': query_data.get('platform', None),
                'document_set': document_set_data,  # Pass the raw document_set data to the QuerySerializer
            })

            if serializer.is_valid():
                serializer.save()
                created_queries.append(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(created_queries, status=status.HTTP_201_CREATED)
        
    def get(self, request, *args, **kwargs):
        utterance = Utterance.objects.filter(uuid=kwargs['uuid']).first()
        queries = Query.objects.filter(utterance=utterance)
        serializer = QuerySerializer(queries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
