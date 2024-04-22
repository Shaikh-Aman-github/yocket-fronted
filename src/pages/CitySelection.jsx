import React, { useState, useEffect } from "react";
import { fetchCops, fetchCities } from "../Request/UserRequest.js";
import { useNavigate } from "react-router-dom";
import "./CitySelection.css";

const CitySelection = ({ onSelectCity }) => {
  const [cops, setCops] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCop, setSelectedCop] = useState(null);
  const [allocatedCities, setAllocatedCities] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getCopsAndCities = async () => {
      try {
        const copsData = await fetchCops();
        const citiesData = await fetchCities();
        setCops(copsData);
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cops or cities:", error);
      }
    };
    getCopsAndCities();
  }, []);

  useEffect(() => {}, [allocatedCities]);

  const handleAllocateCityClick = (cop) => {
    setSelectedCop(cop);
    setShowPopup(true);
    document.body.classList.add("popup-open");
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    document.body.classList.remove("popup-open");
  };

  const handleAllocateCity = (city) => {
    setAllocatedCities((prevAllocatedCities) => ({
      ...prevAllocatedCities,
      [selectedCop.id]: { cop: selectedCop, city: city },
    }));
    localStorage.setItem(
      "allocatedCities",
      JSON.stringify({
        ...allocatedCities,
        [selectedCop.id]: { cop: selectedCop, city: city },
      })
    );
    setShowPopup(false);
    document.body.classList.remove("popup-open");
  };

  useEffect(() => {
    const allocatedCitiesData = JSON.parse(
      localStorage.getItem("allocatedCities")
    );
    if (allocatedCitiesData) {
      setAllocatedCities(allocatedCitiesData);
    }
  }, []);

  const handleRemoveCity = (cop) => {
    const updatedAllocatedCities = { ...allocatedCities };
    delete updatedAllocatedCities[cop.id];
    setAllocatedCities(updatedAllocatedCities);
    localStorage.setItem(
      "allocatedCities",
      JSON.stringify(updatedAllocatedCities)
    );
  };

  const handleAllocateVehicle = () => {
    const selectedCopsData = Object.values(allocatedCities);
    localStorage.setItem("selectedCopsData", JSON.stringify(selectedCopsData));
    navigate("/VehicleSelection");
  };

  return (
    <div style={{ margin: "50px 20px" }}>
      <h4>
        Allocate city to respective cop to find the notorious criminal escape
        artist !!
      </h4>

      <div className="CitySelection-main">
        <div className="card-main">
          {cops.map((cop) => {
            const allocatedCity = allocatedCities[cop.id];
            const isCityAlreadySelected = !!allocatedCity;
            return (
              <div key={cop.id}>
                <div className="card">
                  <p className="card-title">{cop.name}</p>
                  <img className="cop-image" src={cop.image} alt={cop.name} />
                  <button
                    className="Allocate-City"
                    type="button"
                    onClick={() => handleAllocateCityClick(cop)}
                    disabled={isCityAlreadySelected}
                  >
                    Allocate City
                  </button>
                </div>
                {isCityAlreadySelected && (
                  <>
                    <hr className="Line-Selected-city" />
                    <h6>City Distance: {allocatedCity.city.distance} KM</h6>
                    <hr className="Line-Selected-city" />
                    <div className="card">
                      <p className="card-title">{allocatedCity.city.name}</p>
                      <img
                        className="cop-image"
                        src={allocatedCity.city.image}
                        alt={cop.image}
                      />
                      <button
                        className="Allocate-City"
                        onClick={() => handleRemoveCity(cop)}
                      >
                        Remove City
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="popup-close-btn" onClick={handleClosePopup}>
              X
            </button>
            <p>
              Allocate City to: {selectedCop && selectedCop.name} to find
              criminal
            </p>
            <hr />
            <div className="cities-card-main">
              {cities.map((city) => {
                const isCityAlreadyAllocated = Object.values(
                  allocatedCities
                ).some((allocatedCity) => allocatedCity.city.id === city.id);
                return (
                  <div className="cities-card" key={city.id}>
                    <h5 className="cities-card-title">{city.name}</h5>
                    <img
                      className="cities-image"
                      src={city.image}
                      alt={city.name}
                      title={city.dec}
                    />
                    <button
                      className="Select-City-btn"
                      type="button"
                      onClick={() => handleAllocateCity(city)}
                      disabled={isCityAlreadyAllocated}
                    >
                      {isCityAlreadyAllocated ? "Allocated" : "Allocate"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {Object.keys(allocatedCities).length === 3 && (
        <button
          className="startGame"
          style={{ marginTop: "20px" }}
          onClick={handleAllocateVehicle}
        >
          Allocate Vehicle
        </button>
      )}
    </div>
  );
};

export default CitySelection;
