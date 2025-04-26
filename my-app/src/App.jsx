import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense, useRef, useState, useCallback } from 'react';
import { TextureLoader } from 'three';
import { gsap } from 'gsap';
import './App.css';

import Camera from './components/Camera';
import Sun from './components/Sun';
import Planet from './components/Planet';

const App = () => {
  const sunMap = useLoader(TextureLoader, 'sun-texture.jpg');
  const mercuryMap = useLoader(TextureLoader, 'mercury-texture.jpg');
  const venusMap = useLoader(TextureLoader, 'venus-texture.jpg');
  const earthMap = useLoader(TextureLoader, 'earth-texture.jpg');

  const cameraRef = useRef();
  const controlsRef = useRef();
  const resetTween = useRef(null);
  const [isResetting, setIsResetting] = useState(false);
  const [orbitalRingVisibility, setOrbitalRingVisibility] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [activePlanet, setActivePlanet] = useState(null);
  
  const speedOptions = [-500, -200, -100, -50, -20, -10, -5, -2, -1, 0, 1, 2, 5, 10, 20, 50, 100, 200, 500];
  const baseScale = 0.15;

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      setIsResetting(true);
      setActivePlanet(null);

      // Cancel any ongoing animation
      if (resetTween.current) {
        resetTween.current.kill();
      }
  
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
        duration: 1.8,
        ease: 'power2.inOut',
      }, 0)
      .to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.8,
        ease: 'power2.inOut',
      }, 0);
  
      resetTween.current = tl;
    }
  };

  const handlePlanetClick = useCallback((name, position) => {
    if (cameraRef.current && controlsRef.current) {
      setActivePlanet(name);
      setSpeed(0);
      
      // Cancel any ongoing animation
      if (resetTween.current) {
        resetTween.current.kill();
      }

      const zoomDistance = 0.90;
      const cameraOffset = {
        x: position.x * zoomDistance,  
        y: position.y , 
        z: position.z * zoomDistance 
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
          x: position.x + 5,
          y: position.y,
          z: position.z + 5,
          duration: 1.8,
          ease: 'power2.inOut',
        }, 0)
        .to(controlsRef.current.target, {
          x: position.x,
          y: position.y,
          z: position.z,
          duration: 1.8,
          ease: 'power2.inOut',
        }, 0);
      }
      else{
        tl.to(cameraRef.current.position, {
          x: cameraOffset.x,
          y: cameraOffset.y,
          z: cameraOffset.z,
          duration: 1.8,
          ease: 'power2.inOut',
        }, 0)
        .to(controlsRef.current.target, {
          x: position.x,
          y: position.y,
          z: position.z,
          duration: 1.8,
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
          {isResetting ? 'Resetting...' : 'Reset Camera'}  
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
        {(activePlanet != null) && (
          <div className="active-planet">
            Viewing: {activePlanet}
          </div>
        )}
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
            onPlanetClick={handlePlanetClick}
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
            onPlanetClick={handlePlanetClick}
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
            onPlanetClick={handlePlanetClick}
          />

        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;