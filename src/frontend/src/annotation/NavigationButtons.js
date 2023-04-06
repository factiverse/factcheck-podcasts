import { useState, useEffect } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
function NavButton({ disabled, text, onClick, keyStroke }) {

    return (
        <button disabled={disabled} onClick={onClick} className="NavButton btn btn-secondary">
            {text} <span className="badge rounded-pill text-bg-light">{keyStroke}</span>
        </button>
    )
}


export default function NavigationButtons({ index, segmentation, setIndex, setUtterance }) {
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


    return (
        <div className='mt-3'>
            <ButtonGroup>
                <NavButton disabled={isFirst} text="First" keyStroke="↑" onClick={handleFirstClick} />
                <NavButton disabled={isFirst} text="" keyStroke="←" onClick={handlePrevClick} />
                <NavButton disabled={isLast} text="" keyStroke="→" onClick={handleNextClick} />
                <NavButton disabled={isLast} text="Last" keyStroke="↓" onClick={handleLastClick} />
            </ButtonGroup>

            <div className="progress mt-3" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar" style={{ width: (index + 1) * 100 / segmentation.utterance_set.length + '%' }}></div>
            </div>

            <h3>
                ({index + 1} of {segmentation.utterance_set.length})
            </h3>
        </div>
    );
}
