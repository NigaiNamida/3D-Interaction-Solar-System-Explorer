import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { TextureLoader } from 'three';
import { gsap } from 'gsap';
import './App.css';

import Camera from './components/Camera';
import Sun from './components/Sun';
import Planet from './components/Planet';
import PlanetInfo from './components/Planet_Info';

const App = () => {
  const sunMap = useLoader(TextureLoader, 'sun-texture.jpg');
  const mercuryMap = useLoader(TextureLoader, 'mercury-texture.jpg');
  const venusMap = useLoader(TextureLoader, 'venus-texture.jpg');
  const earthMap = useLoader(TextureLoader, 'earth-texture.jpg');

  const cameraRef = useRef();
  const controlsRef = useRef();
  const resetTween = useRef(null);

  const [planetPosition, setPlanetPosition] = useState({});
  const [planetSize, setPlanetSize] = useState({});
  const [planetAngle, setPlanetAngle] = useState({});
  const [planetRadius, setPlanetRadius] = useState({});

  const [isResetting, setIsResetting] = useState(false);
  const [orbitalRingVisibility, setOrbitalRingVisibility] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [focusedPlanet, setFocusedPlanet] = useState(null);
  
  const speedOptions = [-500, -200, -100, -50, -20, -10, -5, -2, -1, 0, 1, 2, 5, 10, 20, 50, 100, 200, 500];
  const baseScale = 0.15;

  const updatePlanetPosition = useCallback((name, position, size, angle, radius) => {
    setPlanetPosition(prev => ({...prev, [name]: position}));
    setPlanetSize(prev => ({...prev, [name]: size}));
    setPlanetAngle(prev => ({...prev, [name]: angle}));
    setPlanetRadius(prev => ({...prev, [name]: radius}));
  }, []);

  useEffect(() => {
    if (cameraRef.current && controlsRef.current && !isResetting && focusedPlanet !== null && focusedPlanet !== "Sun") {
      
      const position = planetPosition[focusedPlanet];
      const angle = planetAngle[focusedPlanet];
      const radius = planetRadius[focusedPlanet];
      const size = planetSize[focusedPlanet];
      
      cameraRef.current.position.set(
        Math.cos(angle.current) * (radius + (size / baseScale) * 1.5),  
        position.y + ((size / baseScale) * 0.5), 
        Math.sin(angle.current) * (radius + (size / baseScale) * 1.5) 
      );
  
      controlsRef.current.target.set(
        position.x,
        position.y,
        position.z
      );
  
      controlsRef.current.update();
    }
  }, [focusedPlanet, isResetting, planetPosition, planetAngle, planetRadius, planetSize, baseScale]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current && !isResetting) {
      setIsResetting(true);
      setFocusedPlanet(null);
  
      const tl = gsap.timeline({
        onUpdate: () => {
          controlsRef.current.update();
        },
        onComplete: () => {
          setIsResetting(false);
        }
      });
  
      tl.to(cameraRef.current.position, {
        x: 0,
        y: 10,
        z: 30,
        duration: 1.5,
        ease: 'power2.inOut',
      }, 0)
      .to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      }, 0);
  
      resetTween.current = tl;
    }
  };

  const handlePlanetClick = useCallback((name, position, size, angle, radius) => {
    if (cameraRef.current && controlsRef.current) {
      setIsResetting(true);
      setFocusedPlanet(name);
      setSpeed(0);

      const cameraOffset = {
        x: Math.cos(angle.current) * (radius + (size / baseScale) * 1.5),  
        y: position.y + ((size / baseScale) * 0.5), 
        z: Math.sin(angle.current) * (radius + (size / baseScale) * 1.5) 
      };
      
      const tl = gsap.timeline({
        onUpdate: () => {
          controlsRef.current.update();
        },
        onComplete: () => {
          setIsResetting(false);
          setSpeed(1);
        }
      });
      
      if (name === "Sun") {
        tl.to(cameraRef.current.position, {
          x: position.x,
          y: position.y + 2.5,
          z: position.z + 7.5,  
          duration: 1.5,
          ease: 'power2.inOut',
        }, 0)
        .to(controlsRef.current.target, {
          x: position.x,
          y: position.y,
          z: position.z,
          duration: 1.5,
          ease: 'power2.inOut',
        }, 0);
      }
      else{
        tl.to(cameraRef.current.position, {
          x: cameraOffset.x,
          y: cameraOffset.y,
          z: cameraOffset.z,
          duration: 1.5,
          ease: 'power2.inOut',
        }, 0)
        .to(controlsRef.current.target, {
          x: position.x,
          y: position.y,
          z: position.z,
          duration: 1.5,
          ease: 'power2.inOut',
        }, 0);
      }
      
      resetTween.current = tl;
    }
  }, []);

  const handleToggleOrbitalRing = () => {
    setOrbitalRingVisibility((prev) => !prev);
  };

  return (
    <div>
      <nav className="navbar">
        <span className="navname">☀️ 3D Interactive Solar System Explorer</span>
        <button className="reset-button" onClick={handleResetCamera}>
          {isResetting ? 'Camera\'s Moving...' : 'Reset Camera'}  
        </button>
        <button className="toggle-button" onClick={handleToggleOrbitalRing}>
          {orbitalRingVisibility ? 'Hide Orbital Rings' : 'Show Orbital Rings'}
        </button>
        <div className="speed-slider">
          <span className="speed-value">Speed x{speed}</span>
          <input 
            type="range" 
            min="0" 
            max={speedOptions.length - 1} 
            step="1" 
            value={speedOptions.indexOf(speed)}
            onChange={(e) => setSpeed(speedOptions[parseInt(e.target.value)])}
          />
        </div>
        <div className="focused-planet">
          Following : {focusedPlanet === null ? 'None' : focusedPlanet}
        </div>
      </nav>
            
      <Canvas>
        <Camera 
          cameraRef={cameraRef} 
          controlsRef={controlsRef} 
          onUserControlStart={() => {
            if (resetTween.current) {
              resetTween.current.kill();
              resetTween.current = null;
            }
            setIsResetting(false);
            setFocusedPlanet(null);
          }}
        />

        <pointLight position={[0, 0, 0]} intensity={1000} />
        <ambientLight intensity={0.2} />

        <Suspense fallback={null}>
          
          {/* Sun */}
          <Sun 
            size={baseScale * 10} 
            textureMap={sunMap} 
            speed={speed} 
            rotationalScale={0.04}
            focusedPlanet={focusedPlanet}
            onPlanetClick={handlePlanetClick}
          />

          {/* Mercury */}
          <Planet 
            name="Mercury"
            size={baseScale * 0.38} 
            textureMap={mercuryMap} 
            speed={speed} 
            rotationalScale={0.017} 
            orbitalScale={1 / 88} 
            radius={baseScale * 45} 
            ring={orbitalRingVisibility}
            focusedPlanet={focusedPlanet}
            onPlanetClick={handlePlanetClick}
            updatePosition={(position, size, angle, radius) => 
              updatePlanetPosition("Mercury", position, size, angle, radius)}
          />

          {/* Venus */}
          <Planet 
            name="Venus"
            size={baseScale * 0.95} 
            textureMap={venusMap} 
            speed={speed} 
            rotationalScale={-0.0041} 
            orbitalScale={1 / 224} 
            radius={baseScale * 84} 
            ring={orbitalRingVisibility}
            focusedPlanet={focusedPlanet}
            onPlanetClick={handlePlanetClick}
            updatePosition={(position, size, angle, radius) => 
              updatePlanetPosition("Venus", position, size, angle, radius)}
          />

          {/* Earth */}
          <Planet 
            name="Earth"
            size={baseScale * 1} 
            textureMap={earthMap} 
            speed={speed} 
            rotationalScale={1} 
            orbitalScale={1 / 365} 
            radius={baseScale * 117} 
            ring={orbitalRingVisibility}
            focusedPlanet={focusedPlanet}
            onPlanetClick={handlePlanetClick}
            updatePosition={(position, size, angle, radius) => 
              updatePlanetPosition("Earth", position, size, angle, radius)}
          />

        </Suspense>
      </Canvas>

      <PlanetInfo 
        focusedPlanet={focusedPlanet} 
      />

    </div>
  );
};

export default App;