import React, { useState, useEffect } from 'react';
import Homepage from './Components/Homepage';
import Login from './Components/Login';
import Register from './Components/Register';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import './index.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const handleLogin = (user) => {
        setUser(user);
    };

    const handleRegister = (user) => {
        setUser(user);
    };

    const handleLogout = () => {
        setUser(null);
        auth.signOut();
        localStorage.removeItem('ticketsRemaining');
        localStorage.removeItem('userTickets');
    };

    if (user) {
        return <Homepage user={user} logout={handleLogout} />;
    }

    return (
        <div className="container">
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
            </button>
            {isRegistering ? (
                <Register onRegister={handleRegister} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
};

export default App;
