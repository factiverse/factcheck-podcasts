import { useState, useEffect } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Button, ProgressBar, Row, Col, InputGroup } from 'react-bootstrap';
import HelpPopUp from './HelpPopUp';

function NavButton({ disabled, text, onClick, keyStroke }) {
    return (
        <button disabled={disabled} onClick={onClick} className="NavButton btn btn-secondary">
            {text} <span className="badge rounded-pill text-bg-light">{keyStroke}</span>
        </button>
    )
}


export default function NavigationButtons({ index, segmentation, setIndex, setUtterance, annotationComplete, factCheckCount, documentCount }) {
    const minFactChecks = segmentation.utterance_set.length;
    const minDocs = segmentation.utterance_set.length * 2;
    const [canSubmit, setCanSubmit] = useState(false);
    // check the annotationComplete dictionary has all true values for any utterance in the segmentation.utterance_set with hidden = false
    // and also confirm that the utterances contain at least minFactChecks fact checks, and the fact checks contain at least minDocs documents
    useEffect(() => {
        if (segmentation.utterance_set) {

            let complete = true;
            for (let i = 0; i < segmentation.utterance_set.length; i++) {

                if (!segmentation.utterance_set[i].hidden && segmentation.utterance_set[i].query_set.length > 0) {
                    for (let j = 0; j < segmentation.utterance_set[i].query_set.length; j++) {
                        if (!segmentation.utterance_set[i].query_set[j].valid) {
                            complete = false;
                            break;
                        }
                    }
                }
            }
            //console.log("first complete", complete)
            if (complete) {
                var fcCount = 0;
                var docCount = 0;
                for (let i = 0; i < segmentation.utterance_set.length; i++) {
                    if (!segmentation.utterance_set[i].hidden && segmentation.utterance_set[i].query_set.length > 0) {
                        for (let j = 0; j < segmentation.utterance_set[i].query_set.length; j++) {
                            if (segmentation.utterance_set[i].query_set[j].valid) {
                                fcCount++;
                                if (segmentation.utterance_set[i].query_set[j].document_set.length > 0) {
                                    for (let k = 0; k < segmentation.utterance_set[i].query_set[j].document_set.length; k++) {
                                        if (segmentation.utterance_set[i].query_set[j].document_set[k].valid) {
                                            docCount++;
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
                setCanSubmit(complete);
                //console.log(complete, "COMPLETE")
            }
        }
    }, [segmentation]);


    let isFirst = false;
    let isLast = false;

    if (index === 0) {
        isFirst = true;
    } else {
        isFirst = false;
    }
    if (index === segmentation.utterance_set.length - 1) {
        isLast = true;
    } else {
        isLast = false;
    }

    // handle what happens on key press
    let handleKeyPress = (event) => {
        if (event.key === 'ArrowRight' && !isLast) {
            event.preventDefault();
            handleNextClick();
        } else if (event.key === 'ArrowLeft' && !isFirst) {
            event.preventDefault();
            handlePrevClick();
        } else if (event.key === 'ArrowUp' && !isFirst) {
            event.preventDefault();
            handleFirstClick();
        } else if (event.key === 'ArrowDown' && !isLast) {
            event.preventDefault();
            handleLastClick();
        }
    };

    useEffect(() => {
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);


    function handleNextClick() {
        const idx = index + 1;
        setIndex(idx);
        setUtterance(segmentation.utterance_set[idx]);
    }
    function handlePrevClick() {
        const idx = index - 1;
        setIndex(idx);
        setUtterance(segmentation.utterance_set[idx]);
    }
    function handleFirstClick() {
        const idx = 0;
        setIndex(idx);
        setUtterance(segmentation.utterance_set[idx]);
    }
    function handleLastClick() {
        const idx = segmentation.utterance_set.length - 1;
        setIndex(idx);
        setUtterance(segmentation.utterance_set[idx]);
    }

    const progressPercentage = (index + 1) * 100 / segmentation.utterance_set.length;

    return (
        <div>
            <Row>
                <Col>
                    <ProgressBar
                        variant="info"
                        now={100 * factCheckCount / minFactChecks}
                    />
                    <div
                        style={{
                            position: 'relative',
                            top: -20,
                            color: (100 * factCheckCount / minFactChecks < 50) ? 'black' : 'white',
                            marginBottom: -20,
                        }}
                    >
                        {`Fact Check QUERY: ${factCheckCount}/${minFactChecks}`}
                    </div>
                    <ProgressBar
                        variant="info"
                        now={100 * documentCount / minDocs}
                    />
                    <div
                        style={{
                            position: 'relative',
                            top: -20,
                            color: 100 * documentCount / minDocs < 50 ? 'black' : 'white',
                            marginBottom: -20,
                        }}
                    >
                        {`Fact Check EVIDENCE: ${documentCount}/${minDocs}`}
                    </div>
                </Col>
                <Col>
                    <ButtonGroup>
                        <NavButton disabled={isFirst} text="First" keyStroke="↑" onClick={handleFirstClick} />
                        <NavButton disabled={isFirst} text="" keyStroke="←" onClick={handlePrevClick} />
                        <NavButton disabled={isLast} text="" keyStroke="→" onClick={handleNextClick} />
                        <NavButton disabled={isLast} text="Last" keyStroke="↓" onClick={handleLastClick} />
                        <Button className='ps-1' style={{ backgroundColor: "transparent" }} disabled={true} variant='secondary'>
                            {Object.values(annotationComplete).some(value => value === false) ? (
                                <span style={{ color: 'red', marginLeft: '5px' }}>
                                    <FaTimes />
                                </span>
                            ) : (
                                <span style={{ color: 'green', marginLeft: '5px' }}>
                                    <FaCheck />
                                </span>
                            )}
                        </Button>
                    </ButtonGroup>
                </Col>
                <Col>
                    <div className='float-end'>
                        <HelpPopUp
                            header={"Final submission after completion of all tasks."}
                            text={"Complete each individual task card for the podcast statement to receive a green checkmark and advance to the next statement. After all statements have a green check mark, and the minimum number of fact checks queries and evidence are submitted, this button will be activated to finalize and return to Prolific."}
                            qualifier={"final-submission"}
                            badgeClass={"me-1"}
                            className={"me-1"}
                        />
                        <Button variant="outline-primary" disabled>Final Submission</Button>
                    </div>

                </Col>
                <Col xxl={12}>


                    <ProgressBar
                        variant="success"
                        now={progressPercentage}
                    />
                    <div
                        style={{
                            position: 'relative',
                            top: -20,
                            color: progressPercentage < 50 ? 'black' : 'white',
                            marginBottom: -15
                        }}
                    >
                        {`STATEMENT: ${index + 1} of ${segmentation.utterance_set.length}`}
                    </div>
                </Col>

            </Row>
        </div>
    );
}
