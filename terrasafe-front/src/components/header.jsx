import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true); // User is signed in
      } else {
        setLoggedIn(false); // User is signed out
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {               
    signOut(auth).then(() => {
    // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully")
    }).catch((error) => {
    // An error happened.
    });
  }

  return (
    <header className='header'>
      <div className='header-left'>
        <a href='/' className='header-link'>TerraSafe</a>
      </div>
      <div className='header-center'>
        <a href="/about" className='header-link'>À propos</a>
        <a href="/history" className='header-link'>Historique</a>
        <a href="/signup" className='header-link'>Faire un don</a>
      </div>
      <div className='header-right'>
        {/* Conditionally render based on authentication status */}
        {loggedIn ? (
          <>
            {/* Display other authenticated links */}
            <a href="/" onClick={handleLogout} className='header-link'><i className="fa-solid fa-right-from-bracket"></i></a>
          </>
        ) : (
          <>
            {/* Display login and sign-up links when not authenticated */}
            <a href="/login" className='header-link'><i className="fas fa-user"></i></a>
            <a href="/signup" className='header-link'><i className="fas fa-user-plus"></i></a>
          </>
        )}
      </div>
    </header>

  );
}
