import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TranscriptionViewer from './podcasts/TranscriptionViewer';
import SegmentationViewer from './podcasts/SegmentationViewer';
import AnnotationProject from './annotation/AnnotationProject';
import axios from 'axios';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import PodcastBrowser from './podcasts/PodcastBrowser';

//dev
axios.defaults.baseURL = 'http://localhost:8000/';
//axios.defaults.baseURL = 'http://192.168.2.239/';
//axios.defaults.baseURL = 'http://192.168.1.145:8888/';
//docker publish
//axios.defaults.baseURL = '/';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>document not found</div>,
  }, {
    path: "/podcasts/",
    element: <PodcastBrowser />
  }, {
    path: "/podcasts/:podcastSlug/",
    element: <PodcastBrowser />
  }, {
    path: "/podcasts/:podcastSlug/:podcastGuid/",
    element: <PodcastBrowser />
  }, {
    path: "/transcriptions/:transcriptUuid/",
    element: <TranscriptionViewer />
  }, {
    path: "/segmentations/:segmentationUuid/",
    element: <SegmentationViewer />
  }, {
    path: "/annotations/:segmentationUuid/",
    element: <AnnotationProject />
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
