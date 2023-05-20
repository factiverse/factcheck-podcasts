import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import EpisodeCard from './EpisodeCard';
import { secondsToHms } from '../util/time';
import DataTable from 'react-data-table-component';
import { Alert } from 'react-bootstrap';
import StringDiff from '../annotation/utterance/StringDiff';

const conditionalRowStyles = [
  {
    when: row => row.qualifier == "Transcription" && row.category != "Approve Original",
    style: {
      backgroundColor: '#fcc3a4',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  {
    when: row => row.qualifier == "Advertising" && row.category != "Not Advertising",
    style: {
      backgroundColor: '#ffd6fd',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
];

const customStyles = {
  rows: {
      style: {
          backgroundColor: '#565757', // override the row height
          color: 'white',
      },
  },
  headCells: {
      style: {
          //paddingLeft: '8px', // override the cell padding for head cells
          //paddingRight: '8px',
      },
  },
  cells: {
      style: {
          //paddingLeft: '8px', // override the cell padding for data cells
          //paddingRight: '8px',
      },
  },
};

// Expanded component with row details
const ExpandedComponent2 = ({ data }) => {
  data.classification_set.sort((a, b) => {
    // Compare qualifiers first
    let compare = a.qualifier.localeCompare(b.qualifier);

    // If qualifiers are equal, compare agents
    if (compare === 0) {
      const aStartsWithNumber = /^\d/.test(a.agent);
      const bStartsWithNumber = /^\d/.test(b.agent);

      if (!aStartsWithNumber && bStartsWithNumber) {
        compare = -1;
      } else if (aStartsWithNumber && !bStartsWithNumber) {
        compare = 1;
      } else {
        compare = a.agent.localeCompare(b.agent);
        // If agents are equal, compare categories
        if (compare === 0) {
          compare = a.category.localeCompare(b.category);
        }
      }
    }

    return compare;
  });

  const columnsClassification = [
    {
      name: "Agent",
      selector: (row) => row.agent,
      width: '15rem',
    },
    {
      name: "Qualifier",
      selector: (row) => row.qualifier,
      width: '10rem',
    },
    {
      name: "Category",
      selector: (row) => row.category,
      width: '10rem',
    },
    {
      name: "Label",
      selector: (row) => row.qualifier == "Transcription" ? <StringDiff stringA={row.original_text ?? ""} stringB={row.label ?? ""}></StringDiff> : row.label,
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
          <section className="bg-light p-3">
            {/* DataTable components here */}
          </section>
        );
      },
    },
  ];

  return (
    <section>
      <div style={{ overflowY: 'auto', backgroundColor: '#E0E0E0' }}>
        {data.classification_set.length > 0 &&
          <DataTable
            columns={columnsClassification}
            data={data.classification_set}
            dense
            direction="auto"
            responsive
            conditionalRowStyles={conditionalRowStyles}
          />
        }
        {data.query_set.length > 0 &&
          <DataTable
            columns={columnsQuery}
            data={data.query_set}
            dense
            direction="auto"
            responsive
          />
        }
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
    cell: row => <div><p className='h6'>{row.text}</p><div style={{color:"#faf884"}}>{row.text_coref}</div></div>,
  },
];


export default function SegmentationViewer() {
  const { segmentationUuid } = useParams();
  const [segmentation, setSegmentation] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState("");
  const [expandAllRows, setExpandAllRows] = useState(true); // new state variable for expanding/collapsing all rows


  

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/segmentations/" + segmentationUuid + "/",
    }).then((response) => {
      const data = response.data;
      // any classification that is qualifier="Transcription" and label is not null or length > 0
      // then add a new field to the classification "original text" and set it to the utterance text
      data.utterance_set.forEach((utterance) => {
        utterance.classification_set.forEach((classification) => {
          if (classification.qualifier === "Transcription" && classification.label) {
            classification.original_text = utterance.text;
          }
        });
      });




      setSegmentation(data);
    }).catch((error) => {
      // Handle error...
    });
  }, [segmentationUuid]);

  // function to toggle the expandAllRows state
  const toggleExpandAllRows = () => {
    setExpandAllRows(!expandAllRows);
  };
  
  return (
    <div>

      <Alert className="d-flex justify-content-between align-items-center p-0 m-0">
        <div>
          <h6 className="mb-0"><strong>Podcast: </strong>{segmentation?.channel?.title}</h6>
        </div>
        <div>
          <h6 className="mb-0"><strong>Segmentation: </strong>{segmentation?.name}</h6>
        </div>
        <div>
          <h6 className="mb-0"><strong>Episode: </strong>{segmentation?.item?.title}</h6>
        </div>
        <button className="btn btn-primary p-1" onClick={toggleExpandAllRows} size="sm">
          {"Toggle Detail"}
        </button>
      </Alert>

      {currentEpisode && <EpisodeCard episode={currentEpisode} />}

      <DataTable
        columns={columnsMain}
        data={segmentation.utterance_set}
        dense
        direction="auto"
        expandableRows
        expandOnRowClicked
        expandableRowsComponent={ExpandedComponent2}
        expandableRowsHideExpander
        expandableRowExpanded={row => expandAllRows}
        fixedHeader
        fixedHeaderScrollHeight="calc(100vh - 60px)"
        responsive
        subHeaderAlign="right"
        subHeaderWrap
        overflow={true}
        customStyles={customStyles}
      />
    </div>

  );

}