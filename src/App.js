import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './App.css';
import Landing from "./pages/LandingPage.jsx"
import CitySelection from "./pages/CitySelection.jsx"
import VehicleSelection from "./pages/VehicleSelection.jsx"
import FindCriminal from "./pages/ResultPage.jsx"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/CitySelection" element={<CitySelection />} />
            <Route path="/VehicleSelection" element={<VehicleSelection />} />
            <Route path="/findCriminal" element={<FindCriminal />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
