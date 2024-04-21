import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './CitySelection.css';

const ResultPage = () => {
  const [capturingCity, setCapturingCity] = useState(null);
  const [criminalData, setCriminalData] = useState(null);
  const [showCapturingCity, setShowCapturingCity] = useState(true); // Control whether to show capturingCity content
  const navigate = useNavigate();

  useEffect(() => { 
    const intervalId = setInterval(() => {
      const selectedCopsData = JSON.parse(localStorage.getItem('findCriminal'));
      if (selectedCopsData) {
        const randomIndex = Math.floor(Math.random() * selectedCopsData.length);
        const city = selectedCopsData[randomIndex].city;
        setCapturingCity(city);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const storedCopsData = JSON.parse(localStorage.getItem('findCriminal'));
    if (!storedCopsData) {
      localStorage.removeItem("result");
      navigate('/CitySelection');
    } else {
      setCapturingCity(storedCopsData);
    }
  }, [navigate]);

  useEffect(() => {
    // Delay setting criminalData for 5 seconds
    const timeoutId = setTimeout(() => {
      const storedResult = JSON.parse(localStorage.getItem('result'));
      setCriminalData(storedResult);
      setShowCapturingCity(false); // Hide capturingCity content
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  const findAgain = () => {
    localStorage.clear();
    navigate('/CitySelection'); 
  }

  return (
    <div>
      {showCapturingCity && capturingCity && (<h5>Searching Criminal...</h5>)}{' '}
      <div className='card-main'>
        {showCapturingCity && capturingCity && ( 
          <div className='card' style={{ padding: "10px" }}>
            <p className='card-title'>{capturingCity.name}</p>
            <img className="cop-image" style={{ borderRadius: "50%" }} src={capturingCity.image} alt={capturingCity.name} />
          </div>
        )}
      </div>
      {criminalData && criminalData.data ? (
        <div>
          <p>Status: {criminalData.status}</p>
          <div className='card' style={{ padding: "10px" }}>
            <p className='card-title'>{criminalData.data.cop.name}</p>
            <img className="cop-image" style={{ borderRadius: "50%", height: "200px", width: "200px" }} src={criminalData.data.cop.image} alt={criminalData.data.cop.name} />
          </div>
          <button className="startGame" style={{ marginTop: "20px" }} onClick={findAgain}>Find again</button>
        </div>
      ) : (
        <div>
          <p>{criminalData && criminalData.status}</p>
          {criminalData &&<button className="startGame" style={{ marginTop: "20px" }} onClick={findAgain}>Find again</button>}
        </div>
      )}

    </div>
  );
};

export default ResultPage;
