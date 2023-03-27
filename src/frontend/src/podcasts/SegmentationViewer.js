import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import EpisodeCard from './EpisodeCard';
import { secondsToHms } from '../util/time';
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';

// A super simple expandable component.
const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

const columns = [
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
  const [currentEpisode , setCurrentEpisode] = useState("");
  useEffect(() => {
    axios({
        method: "GET",
        url:"/api/segmentations/" + segmentationUuid + "/",
      }).then((response)=>{
        const data = response.data;
        setSegmentation(data);
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          }
      });
      } ,[]);



  return (
    <div>
    <style>{styles}</style>
    {currentEpisode && <EpisodeCard episode={currentEpisode} />}
    
    <DataTable
      columns={columns}
      data={segmentation.utterance_set}
      dense
      direction="auto"
      expandOnRowClicked
      expandableRows
      expandableRowsComponent={ExpandedComponent}
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