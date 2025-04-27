import { useState, useEffect } from 'react';

import { INFO } from './Data';

const PlanetInfo = ({ focusedPlanet }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (focusedPlanet) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [focusedPlanet]);
  
  
  if (!focusedPlanet || !INFO[focusedPlanet]) {
    return null;
  }
  
  const currentPlanet = {
    name: focusedPlanet,
    orbitalPeriod: INFO[focusedPlanet].ORBITAL_PERIOD,
    rotationPeriod: INFO[focusedPlanet].ROTATION_PERIOD,
    distance: INFO[focusedPlanet].DISTANCE,
    diameter: INFO[focusedPlanet].DIAMETER
  };
  
  return (
    <div className={`planet-info-popup ${isVisible ? 'visible' : ''}`}>
      <h2>{currentPlanet.name}</h2>

      <div className="planet-stats">
        <div className="stat">
          <span className="label">Orbital Period : </span>
          <span className="value">{currentPlanet.orbitalPeriod}</span>
        </div>

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