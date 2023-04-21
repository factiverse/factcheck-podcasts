import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import EpisodeCard from './EpisodeCard';
import { secondsToHms } from '../util/time';
import DataTable from 'react-data-table-component';

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
};

const customTableStyles = {
  table: {
    style: {
      backgroundColor: '#E0E0E0',
    },
  },
  headRow: {
    style: {
      backgroundColor: "#E0E0E0",
    },
  },
  rows: {
    style: {
      backgroundColor: '#E0E0E0',
    },
  },
};



// an expanded component with row details
const ExpandedComponent2 = ({ data }) => {

  const columnsClassification = [
    {
      name: "Agent",
      selector: (row) => row.agent,
      width: '10rem',
    },
    {
      name: "Qualifier",
      selector: (row) => row.qualifier,
      width: '10rem',
    },
    {
      name: "Label",
      selector: (row) => row.label,
      width: '10rem',
    },
    {
      name: "Category",
      selector: (row) => row.category,
    },
  ];

  const columnsQuery = [
    {
      name: "Agent",
      selector: (row) => row.agent,
      width: '10rem',
    },
    {
      name: "Qualifier",
      selector: (row) => "Fact Check",
      width: '10rem',
    },
    {
      name: "Contents",
      cell: row => {
        const displayText = row.query.length > 100 ? row.query.substring(0, 100) + "..." : row.query;
      
        return (
          <div>
              <strong>{row.platform}</strong> - {
                isValidUrl(row.query) ? (
                  <a href={row.query} target="_blank" rel="noreferrer">
                    <em>{displayText}</em>
                  </a>
                ) : (
                  <em>{row.query}</em>
                )
              }
              
              <ul>
              {row.document_set.map((doc) => {
                return (
                  <li key={doc.uuid}>
                    <a href={doc.document} target="_blank" rel="noreferrer">{doc.document}</a>
                    <p>{doc.comment}</p>
                  </li>
                );
      
              })}
              
              </ul>
          </div>
        );
      },
    },
  ];

  return (
    <section>
      <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#E0E0E0'}}>
      {data.classification_set.length > 0 && <DataTable
          columns={columnsClassification}
          data={data.classification_set}
          dense
          direction="auto"
          responsive
          customStyles={customTableStyles}
        />}
        {data.query_set.length > 0 && <DataTable
          columns={columnsQuery}
          data={data.query_set}
          dense
          direction="auto"
          responsive
          customStyles={customTableStyles}
        />}
      </div>
    </section>
  );
};

const columnsMain = [
  {
    name: 'Start',
    selector: row => secondsToHms(row.start),
    sortable: true,
    width: '5rem',
  },
  {
    name: 'End',
    selector: row => secondsToHms(row.end),
    sortable: true,
    width: '5rem',
  },
  {
    name: 'ClaimBuster BBA',
    selector: row => row.classification_set.filter((item) => item.agent === "ClaimBuster-BBA").shift()?.label || "",
    sortable: true,
    width: '5rem',
  },
  {
    name: 'Speaker',
    selector: row => row.speaker,
    sortable: true,
    width: '8rem',
  },
  {
    name: 'Text',
    cell: row => <div><p className='h6'>{row.text}</p><div>{row.text_coref}</div></div>,
  },
];

const styles = `
.sc-dnwKUv {
  overflow: visible;
}


`;

export default function SegmentationViewer() {
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