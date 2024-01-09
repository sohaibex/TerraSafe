import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showGoFundMePopUp, setShowGoFundMePopUp] = useState(false);

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

  const handleGoFundMeClick = () => {
    setShowGoFundMePopUp(true); // Show the GoFundMe pop-up when clicked
  }

  return (
    <header className='header'>
      <div className='header-section'>
        <div className='header-section-left'>
          <a href='/' className='header-section-link'>TerraSafe</a>
        </div>
        <div className='header-section-center'>
          <a href="/about" className='header-section-link'>À propos</a>
          <a href="/history" className='header-section-link'>Historique</a>
          <button onClick={handleGoFundMeClick} className='header-section-link'>Faire un don</button>
        </div>
        <div className='header-section-right'>
          {/* Conditionally render based on authentication status */}
          {loggedIn ? (
            <>
              {/* Display other authenticated links */}
              <a href="/" onClick={handleLogout} className='header-section-link'><i className="fa-solid fa-right-from-bracket"></i></a>
            </>
          ) : (
            <>
              {/* Display login and sign-up links when not authenticated */}
              <a href="/login" className='header-section-link'><i className="fas fa-user"></i></a>
              <a href="/signup" className='header-section-link'><i className="fas fa-user-plus"></i></a>
            </>
          )}
        </div>
      </div>
      

      {showGoFundMePopUp && (
      <div className="gofundme-overlay">
        <span className="close-btn" onClick={() => setShowGoFundMePopUp(false)}>
         <i class="fa-solid fa-xmark"></i>
        </span>
        <div className="gofundme-popup">
            <iframe
              src="https://www.gofundme.com/f/test-for-project-school-dont-donate/widget/large?sharesheet=firstTime"
              frameBorder="0"
              width="100%"
              height="100%"
              title="Donation"
            ></iframe>
        </div>
      </div>
    )}
    </header>

  );
}
