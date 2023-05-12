import React from 'react';
export const circleStyle = {
    border: '1px solid',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5px',
};

function CircleFirstLetter({ text }) {
    if (!text) return null;

    const firstLetter = text.charAt(0);
    const remainingText = text.slice(1);

    return (
        <>
            <span className='me-0' style={circleStyle}>{firstLetter}</span>
            {remainingText}
        </>
    );
}

export default CircleFirstLetter;
