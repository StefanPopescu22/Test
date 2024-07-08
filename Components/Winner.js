import React from 'react';

const Winner = ({ ticket }) => {
    return (
        <div className="winner">
            <h2>Tichetul câștigător este: {ticket}</h2>
        </div>
    );
};

export default Winner;
