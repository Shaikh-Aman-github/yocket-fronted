  import React, { useState, useEffect } from 'react';
  import { fetchVehicles,findCriminal } from '../Request/UserRequest.js';
  import { useNavigate } from "react-router-dom";
  import './CitySelection.css';

  const VehicleSelection = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedCopsData, setSelectedCopsData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCop, setSelectedCop] = useState(null); 
    const [selectedCity, setSelectedCity] = useState(null); 
    const [isVehicleAllocated, setIsVehicleAllocated] = useState(false); // State to track vehicle allocation
    const [allVehiclesAllocated, setAllVehiclesAllocated] = useState(false); // State to track if all vehicles are allocated
    const navigate = useNavigate();

    useEffect(() => {
      const storedCopsData = JSON.parse(localStorage.getItem('selectedCopsData'));
      if (!storedCopsData) {
        navigate('/CitySelection');
      } else {
        setSelectedCopsData(storedCopsData);
      }
    }, [navigate]);

    useEffect(() => {
      const getVehicles = async () => {
        try {
          const vehiclesData = await fetchVehicles();
          setVehicles(vehiclesData);
        } catch (error) {
          console.error('Error fetching vehiclesData:', error);
        }
      };
      getVehicles();
    }, []);

    useEffect(() => {
      const storedCopsData = JSON.parse(localStorage.getItem('selectedCopsData'));
      setSelectedCopsData(storedCopsData ? storedCopsData : []); // Ensure it's an array
    }, []);

    useEffect(() => {
      // Check if all vehicles are allocated
      const isAllAllocated = selectedCopsData.every(data => data.vehicle !== null);
      setAllVehiclesAllocated(isAllAllocated);
    }, [selectedCopsData]);

    const handleVehicleSelect = (cop, city) => {
      setSelectedCop(cop);
      setSelectedCity(city);
      setShowPopup(true);
      document.body.classList.add('popup-open');

      // Check if the cop already has a vehicle allocated
      const isAllocated = selectedCopsData.some(data => data.cop.id === cop.id && data.vehicle);
      setIsVehicleAllocated(isAllocated);
    };
    
    const handleClosePopup = () => {
      setShowPopup(false);
      document.body.classList.remove('popup-open');
    };

    const handleAllocateVehicle = (vehicle) => {
      const updatedSelectedCopsData = selectedCopsData.map(({ cop, city, vehicle: allocatedVehicle }) => {
        if (cop.id === selectedCop.id && city.id === selectedCity.id) {
          return {
            cop,
            city,
            vehicle: vehicle
          };
        }
        return { cop, city, vehicle: allocatedVehicle };
      });
    
      setSelectedCopsData(updatedSelectedCopsData);
    
      // Update or add the allocated vehicle to the selectedCopsData localStorage
      localStorage.setItem('selectedCopsData', JSON.stringify(updatedSelectedCopsData));
    
      // Decrement vehicle count
      const updatedVehicles = vehicles.map(v => {
        if (v.id === vehicle.id) {
          return { ...v, count: v.count - 1 };
        }
        return v;
      });
      setVehicles(updatedVehicles);
    
      setShowPopup(false);
      document.body.classList.remove('popup-open');
      setIsVehicleAllocated(true); // Set vehicle allocated state to true
    };

    const handleFindCriminal = async () => {
      try {
        localStorage.setItem('findCriminal', JSON.stringify(selectedCopsData));
        // Send the selected cops' data to the server
        const data = await findCriminal(selectedCopsData);
        localStorage.setItem('result', JSON.stringify(data));
        navigate("/findCriminal");
        // Navigate to the findCriminal page
        localStorage.removeItem("selectedCopsData");
        localStorage.removeItem("allocatedCities");
      } catch (error) {
        console.error('Error fetching criminal:', error);
        // Handle error
      }
    };
    return (
      <div style={{ margin: "50px 20px 100px 20px" }}>
        <h4>Allocate Vehicle to respective cop to find the notorious criminal escape artist !!</h4>
        <div className='CitySelection-main'>
          <div className='card-main'>
            {selectedCopsData.map(({ cop, city, vehicle }) => (
              <div key={cop.id} className='city-main'>
                <div className='card'>
                  <p className='card-title'>{cop.name}</p>
                  <img className="cop-image" src={cop.image} alt={cop.name} />
                  <button className="Allocate-City" style={{cursor: "not-allowed"}} type="button" disabled>Allocate City</button>
                </div>
                <hr className='Line-Selected-city' />
                <h6>City Distance: {city.distance} KM</h6>
                <hr className='Line-Selected-city' />
                <div className='card'>
                  <p className='card-title'>{city.name}</p>
                  <img className="cop-image" src={city.image} alt={city.name} />
                  <button className="Allocate-City" style={{cursor: "not-allowed"}} disabled>Remove City</button>
                </div>
                <button className="startGame" style={{ marginTop: "20px" }} onClick={() => handleVehicleSelect(cop, city)}> 
                  {isVehicleAllocated ? "Vehicle Allocated" : "Allocate Vehicle"}
                </button>
                {vehicle && (
                  <>
                    <hr className='Line-Selected-city' />
                    <div className='card'>
                      <div className='cities-card' key={city.id}>
                        {vehicle && <p>{vehicle.kind}</p>}
                        {vehicle && <img className="cities-image" src={vehicle.image} alt={vehicle.name} title={vehicle.name} />}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <button className="popup-close-btn" onClick={handleClosePopup}>X</button>
              <p>Allocate Vehicle to:   to find criminal</p>
              <hr />
              <div className='cities-card-main'>
                {vehicles.map(vehicle => (
                  <div className='cities-card' key={vehicle.id}>
                    <h6 className='cities-card-title'>{vehicle.kind}</h6>
                    <img className="cities-image" src={vehicle.image} alt={vehicle.kind} title={vehicle.kind} />
                    <button className="Select-City-btn" type="button" onClick={() => handleAllocateVehicle(vehicle)} disabled={vehicle.count === 0} >
                      {vehicle.count === 0 ? "Allocated" : "Allocate"}
                    </button>
                    <h6 className='cities-card-title' style={{color:"#282c34"}}>Availability: {vehicle.count}  <br/> Range: {vehicle.range} KM</h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {allVehiclesAllocated && (
          <button className="startGame" style={{ marginTop: "20px" }} onClick={handleFindCriminal}>Find Criminal Now</button>
        )}
      </div>
    );
  };

  export default VehicleSelection;
