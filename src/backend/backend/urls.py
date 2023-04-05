"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path
from .api.views import AudioChannelApiView, TranscriptionApiView, UtteranceApiView, SegmentationApiView, ClassificationApiView, QueryApiView, MediaFileView

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/podcasts/', AudioChannelApiView.as_view()),
    #path('api/podcasts/<slug:slug>/episodes/', AudioItemApiView.as_view()), # used in db population notebook
    path('api/transcriptions/<str:uuid>/', TranscriptionApiView.as_view()), # get transcription
    path('api/transcriptions/', TranscriptionApiView.as_view()), # post transcription
    path('api/segmentations/<str:uuid>/', SegmentationApiView.as_view()), # get segmentations
    path('api/podcasts/<slug:slug>/<str:guid>/utterances/', UtteranceApiView.as_view()),# post segmentations
    path('api/classifications/<str:uuid>/', ClassificationApiView.as_view()),
    path('api/factchecks/<str:uuid>/', QueryApiView.as_view()),
    re_path(r'^media/(?P<path>.+)$', MediaFileView.as_view(), name='media-file'),
]
