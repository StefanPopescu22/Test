import React from 'react';

const TicketPurchase = ({ onPurchase }) => {
    return (
        <button onClick={onPurchase}>Cumpără Tichet</button>
    );
};

export default TicketPurchase;
