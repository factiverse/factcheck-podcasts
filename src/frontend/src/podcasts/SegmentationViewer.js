import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import EpisodeCard from './EpisodeCard';
import { secondsToHms } from '../util/time';
import DataTable from 'react-data-table-component';

/* EXAMPLE OF MY JSON FROM API
{
  "start": "0.28",
  "end": "8.56",
  "speaker": null,
  "text": "Holland Norway Lines. Snarve en til puls. Bestil bilpakke fra Kristiansand til Nederland på HollandNorwayLines.no",
  "text_coref": null,
  "summary": null,
  "uuid": "f464d018-c4d7-11ed-af8b-bbfb0cc12fbc",
  "classification_set": [
    {
      "utterance": 8497,
      "qualifier": "Checkworthiness",
      "label": "Greetings",
      "category": "Not Checkworthy",
      "agent": "test_user"
    }
  ],
  "query_set": [
    {
      "utterance": 8497,
      "query": "ååå",
      "platform": null,
      "agent": "test-agent",
      "uuid": "740dfdf0-cef9-11ed-9850-8cb87e798e42",
      "document_set": [
        {
          "document": "ææææ",
          "supports": 1,
          "comment": null,
          "uuid": "740f847b-cef9-11ed-a007-8cb87e798e42"
        }
      ]
    }
  ]
}

*/


// A super simple expandable component.
const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data.classification_set, null, 2)}</pre>;


// an expanded component that itself contains a react-data-table component,
// with rows for entries from both classification_set and query_set
const ExpandedComponent2 = ({ data }) => {
  const combinedData = data.classification_set.map((item) => ({
    ...item,
    type: "classification",
  })).concat(data.query_set.map((item) => ({
    ...item,
    type: "query",
  })));

  const columns = [
    {
      name: "Type",
      selector: (row) => row.type,
    },
    {
      name: "Qualifier",
      selector: (row) => row.type === "classification" ? row.qualifier : "",
    },
    {
      name: "Label",
      selector: (row) => row.type === "classification" ? row.label : "",
    },
    {
      name: "Category",
      selector: (row) => row.type === "classification" ? row.category : "",
    },
    {
      name: "Agent",
      selector: (row) => row.agent,
    },
    {
      name: "Query",
      selector: (row) => row.type === "query" ? row.query : "",
    },
    {
      name: "Platform",
      selector: (row) => row.type === "query" ? row.platform : "",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={combinedData}
      dense
      direction="auto"
      fixedHeader
      fixedHeaderScrollHeight="300px"
      responsive
      subHeaderAlign="right"
      subHeaderWrap
      overflow={true}
    />
  );
};


const columnsMain = [
  {
    name: 'Start',
    selector: row => secondsToHms(row.start),
    sortable: true,
    shrink: 2,
  },
  {
    name: 'End',
    selector: row => secondsToHms(row.end),
    sortable: true,
    shrink: 2,
  },
  {
    name: 'Speaker',
    selector: row => row.speaker,
    sortable: true,
  },
  {
    name: 'Text',
    selector: row => row.text,
    grow: 4,
  },
];

const styles = `
.eixEah {
  overflow: visible;
}
`;

export default function TranscriptionViewer() {
  const { segmentationUuid } = useParams();
  const [segmentation, setSegmentation] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState("");
  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/segmentations/" + segmentationUuid + "/",
    }).then((response) => {
      const data = response.data;
      setSegmentation(data);
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }, []);



  return (
    <div>
      <style>{styles}</style>
      {currentEpisode && <EpisodeCard episode={currentEpisode} />}

      <DataTable
        columns={columnsMain}
        data={segmentation.utterance_set}
        dense
        direction="auto"
        expandOnRowClicked
        expandableRows
        expandableRowsComponent={ExpandedComponent2}
        fixedHeader
        fixedHeaderScrollHeight="300px"
        responsive
        subHeaderAlign="right"
        subHeaderWrap
        overflow={true}
      />




    </div>
  );

}