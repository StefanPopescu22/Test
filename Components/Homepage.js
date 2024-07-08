import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import TicketPurchase from './TicketPurchase';
import Winner from './Winner';

const Homepage = ({ user, logout }) => {
    const [ticketsRemaining, setTicketsRemaining] = useState(50);
    const [winner, setWinner] = useState(null);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const storedTickets = localStorage.getItem('ticketsRemaining');
        if (storedTickets) {
            setTicketsRemaining(parseInt(storedTickets, 10));
        } else {
            setTicketsRemaining(50);
        }
        
        const fetchTickets = async () => {
            const q = query(collection(db, 'tickets'), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const userTickets = [];
            querySnapshot.forEach((doc) => {
                userTickets.push({ id: doc.id, ...doc.data() });
            });
            setTickets(userTickets);
            localStorage.setItem('userTickets', JSON.stringify(userTickets));
        };
        fetchTickets();
    }, [user]);

    const handlePurchase = async () => {
        if (ticketsRemaining > 0) {
            const newTicket = {
                userId: user.uid,
                ticketId: `A${ticketsRemaining}`,  
            };
            const docRef = await addDoc(collection(db, 'tickets'), newTicket);
            setTicketsRemaining(ticketsRemaining - 1);
            setTickets([...tickets, { id: docRef.id, ...newTicket }]);
            localStorage.setItem('ticketsRemaining', ticketsRemaining - 1);
            localStorage.setItem('userTickets', JSON.stringify([...tickets, { id: docRef.id, ...newTicket }]));
        }
    };

    const handleDrawWinner = async () => {
        if (ticketsRemaining === 0 && !winner) {
            const winnerTicketId = await fetchWinner();
            if (winnerTicketId) {
                setWinner(winnerTicketId);
                const winnerTicketQuery = query(collection(db, 'tickets'), where("ticketId", "==", winnerTicketId));
                const querySnapshot = await getDocs(winnerTicketQuery);
                if (!querySnapshot.empty) {
                    const winningTicket = querySnapshot.docs[0].data();
                    if (winningTicket.userId === user.uid) {
                        alert('Felicitări! Ai câștigat premiul!');
                    } else {
                        alert('Ne pare rău, nu ai câștigat.');
                    }
                }
            }
        }
    };

    const fetchWinner = async () => {
        try {
            const response = await fetch('https://api.random.org/json-rpc/4/invoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "generateIntegers",
                    params: {
                       
                        n: 1,
                        min: 1,
                        max: 50
                    },
                    id: 42
                })
            });
            const data = await response.json();
            if (data.result && data.result.random && data.result.random.data) {
                return `A${data.result.random.data[0]}`;
            } else {
                throw new Error('Invalid response structure from random.org');
            }
        } catch (error) {
            console.error('Failed to fetch winner:', error);
            alert('A apărut o eroare la extragerea câștigătorului. Vă rugăm să încercați din nou.');
            return null;
        }
    };

    const handleLogout = async () => {
        // Delete user's tickets from Firestore
        const userTickets = JSON.parse(localStorage.getItem('userTickets'));
        if (userTickets) {
            for (const ticket of userTickets) {
                await deleteDoc(doc(db, 'tickets', ticket.id));
            }
        }
        // Reset the local state
        setTicketsRemaining(50);
        setTickets([]);
        logout();
    };

    return (
        <div className="container">
            <h1>Tombola - Câștigă o mașină de lux!</h1>
            <p>Bine ai venit, {user.email}!</p>
            <button onClick={handleLogout}>Logout</button>
            <p>Tichete rămase: {ticketsRemaining}</p>
            <TicketPurchase onPurchase={handlePurchase} />
            {ticketsRemaining === 0 && !winner && <button onClick={handleDrawWinner}>Extrage Câștigător</button>}
            {winner && <Winner ticket={winner} />}
            <div>
                <h2>Tichetele tale:</h2>
                <ul>
                    {tickets.map((ticket, index) => (
                        <li key={index}>{ticket.ticketId}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Homepage;
