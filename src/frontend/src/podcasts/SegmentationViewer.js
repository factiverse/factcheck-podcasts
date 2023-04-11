import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import EpisodeCard from './EpisodeCard';
import { secondsToHms } from '../util/time';
import DataTable from 'react-data-table-component';


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
    //{
    //  name: "Query",
    //  selector: (row) => row.type === "query" ? row.query : "",
    //},
    //{
    //  name: "Platform",
    //  selector: (row) => row.type === "query" ? row.platform : "",
    //},
  ];

  return (
    <DataTable
      columns={columns}
      data={data.classification_set}
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
    width: '100px',
  },
  {
    name: 'End',
    selector: row => secondsToHms(row.end),
    sortable: true,
    width: '100px',
  },
  {
    name: 'ClaimBuster BBA',
    selector: row => row.classification_set.filter((item) => item.agent === "ClaimBuster-BBA").shift()?.label || "",
    sortable: true,
    width: '150px',
  },
  {
    name: 'Speaker',
    selector: row => row.speaker,
    sortable: true,
    width: '150px',
  },
  {
    name: 'Text',
    selector: row => row.text,
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