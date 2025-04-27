// PlanetInfo.jsx
import { useState, useEffect } from 'react';

const PlanetInfo = ({ focusedPlanet }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (focusedPlanet) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [focusedPlanet]);
  
  // Planet data mapping
  const planetInfo = {
    Sun: {
      name: "Sun",
      rotationPeriod: "25-35 days",
      distance: "0",
      diameter: "1,392,700 km",
    },
    Mercury: {
      name: "Mercury",
      rotationPeriod: "59 days",
      distance: "57.9 million km",
      diameter: "4,880 km",
    },
    Venus: {
      name: "Venus",
      rotationPeriod: "243 days",
      distance: "108.2 million km",
      diameter: "12,104 km",
    },
    Earth: {
      name: "Earth",
      rotationPeriod: "24 hours",
      distance: "149.6 million km",
      diameter: "12,742 km",
    }
  };
  
  if (!focusedPlanet || !planetInfo[focusedPlanet]) {
    return null;
  }
  
  const currentPlanet = planetInfo[focusedPlanet];
  
  return (
    <div className={`planet-info-popup ${visible ? 'visible' : ''}`}>
      <h2>{currentPlanet.name}</h2>
      <div className="planet-stats">
        <div className="stat">
          <span className="label">Rotation Period : </span>
          <span className="value">{currentPlanet.rotationPeriod}</span>
        </div>
        <div className="stat">
          <span className="label">Distance from Sun : </span>
          <span className="value">{currentPlanet.distance}</span>
        </div>
        <div className="stat">
          <span className="label">Diameter : </span>
          <span className="value">{currentPlanet.diameter}</span>
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo;