import { useState, useEffect } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Button, ProgressBar, Row, Col, Alert } from 'react-bootstrap';
import HelpPopUp from './help/HelpPopUp';
import FinalizeModal from './modal/FinalizeModal';
import WelcomeModal from './modal/WelcomeModal';
import { validateAnnotations } from '../util/validate';
import { helpPopUpData } from './help/help';
function NavButton({ disabled, text, onClick, keyStroke }) {
    return (
        <button disabled={disabled} onClick={onClick} className="NavButton btn btn-secondary">
            {text} <span className="badge rounded-pill text-bg-light">{keyStroke}</span>
        </button>
    )
}

export default function NavigationButtons({ index, segmentation, setIndex, utterance, setUtterance, factCheckCount, documentCount }) {
    const minFactChecks = segmentation.utterance_set.length;
    const minDocs = segmentation.utterance_set.length * 2;
    const [canSubmit, setCanSubmit] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);

    // functions to handle opening and closing of the welcome and finalize modals
    const handleWelcomeModalClose = () => setShowWelcomeModal(false);
    const handleWelcomeModalShow = () => setShowWelcomeModal(true);
    const handleFinalizeModalClose = () => setShowFinalizeModal(false);
    const handleFinalizeModalShow = () => setShowFinalizeModal(true);

    useEffect(() => {
        if (segmentation) {
            const validation = validateAnnotations(segmentation, minFactChecks, minDocs)
            setCanSubmit(validation.complete);
            setErrorMessage(validation.errorTxt);
        }
    }, [utterance, utterance?.classification_set, factCheckCount, documentCount]);

    // keep track of where the counter is in the utterance set to enable/disable buttons
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
            {segmentation.item && segmentation.channel &&
                <Alert variant="secondary" className='p-2 mt-1 mb-1'>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className='overflow-hidden d-flex align-items-center py-0 w-50'>
                            <div className="d-flex align-items-center p-0 m-0">
                                <Button variant="success" size="sm" className="me-2" onClick={handleWelcomeModalShow}>HELP</Button>
                                <WelcomeModal
                                    show={showWelcomeModal}
                                    handleClose={handleWelcomeModalClose}
                                    segmentation={segmentation}
                                >

                                </WelcomeModal>
                                <p className='h4 text-truncate text-uppercase mb-0'>{segmentation.channel.title}</p>
                            </div>
                        </div>
                        <div className="overflow-hidden d-flex">
                            <div className='d-flex align-items-center'>
                                <p className='h4 text-truncate text-muted mb-0'>{segmentation.item.title}</p>
                            </div>
                        </div>
                    </div>
                </Alert>
            }

            <Row className='pt-0'>
                {/* QUERY / EVIDENCE COUNT */}
                <Col>
                    <ProgressBar
                        variant="primary"
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
                        variant="primary"
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

                {/* CENTER NAV BUTTONS */}
                <Col>
                    <ButtonGroup>
                        <NavButton disabled={isFirst} text="First" keyStroke="↑" onClick={handleFirstClick} />
                        <NavButton disabled={isFirst} text="" keyStroke="←" onClick={handlePrevClick} />
                        <NavButton disabled={isLast} text="" keyStroke="→" onClick={handleNextClick} />
                        <NavButton disabled={isLast} text="Last" keyStroke="↓" onClick={handleLastClick} />
                        <Button className='ps-1' style={{ backgroundColor: "transparent" }} disabled={true} variant='secondary'>
                            {utterance && validateAnnotations({ utterance_set: [utterance] }, 0, 0, true).complete ? (
                                <span style={{ color: 'green', marginLeft: '5px' }}>
                                    <FaCheck />
                                </span>

                            ) : (
                                <span style={{ color: 'red', marginLeft: '5px' }}>
                                    <FaTimes />
                                </span>
                            )}
                        </Button>
                    </ButtonGroup>
                </Col>

                {/* FINAL SUBMIT BUTTON */}
                <Col>
                    <div className='float-end position-relative'>
                        <HelpPopUp
                            header={helpPopUpData["FinalSubmission"].helpHeader}
                            text={helpPopUpData["FinalSubmission"].helpText + "\n" + errorMessage}
                            qualifier={"FinalSubmission"}
                            badgeClass={"me-1"}
                        />
                        <Button variant={canSubmit ? "success" : "outline-primary"} disabled={!canSubmit} onClick={handleFinalizeModalShow}>Final Submission</Button>
                        <FinalizeModal show={showFinalizeModal} handleClose={handleFinalizeModalClose}></FinalizeModal>
                    </div>
                </Col>

                {/* UTTERANCE PROGRESS BAR */}
                <Col xxl={12} className='mt-1'>
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
