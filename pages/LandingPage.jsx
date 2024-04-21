import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from '../images/Landing-logo.gif';
import './LandingPage.css';
import useTypingAnimation from '../components/TypingTitle'; // Import the custom hook
import { fetchCriminal } from '../Request/UserRequest'; // Import the fetchCriminal function

function LandingPage() {
  const [showImage, setShowImage] = useState(true);
  const [criminalData, setCriminalData] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowImage(false);
    }, Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCriminal();
        setCriminalData(data[0]); // Assuming you only have one criminal data object
      } catch (error) {
        console.error('Error fetching criminal:', error);
      }
    };

    fetchData();
  }, []);

  const startGame = () => {
    navigate("/CitySelection");
  };

  const animatedText = useTypingAnimation("A notorious criminal escape artist has vanished again. However, the criminal may be hiding in only one of the possible 5 neighbouring cities. 3 fearless cops have volunteered in capturing the fugitive hiding and they need your help!", 50);

  return (
    <div className="Landing">
      <header className="Landing-header">
        {showImage ? (
          <img src={logo} className="Landing-logo" alt="logo" />
        ) : (
          <div>
            <h1>WANTED</h1>

            <img  className="Criminal-image" src={criminalData.image} alt={criminalData.name} srcset="" />
            <h5>{animatedText}</h5>
            <button onClick={startGame} className="startGame" title='Help to find the Criminal'>Start</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default LandingPage;
