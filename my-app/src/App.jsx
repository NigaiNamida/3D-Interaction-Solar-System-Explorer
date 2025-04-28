import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { TextureLoader } from 'three';
import { gsap } from 'gsap';
import './App.css';

import { SOLAR_SYSTEM, SPEED_OPTIONS, DEFAULT_SPEED, CAMERA } from './components/Data';

import Camera from './components/Camera';
import Sun from './components/Sun';
import Planet from './components/Planet';
import PlanetInfo from './components/Info_Popup';

const App = () => {
  const SUN_MAP = useLoader(TextureLoader, 'sun-texture.jpg');
  const MERCURY_MAP = useLoader(TextureLoader, 'mercury-texture.jpg');
  const VENUS_MAP = useLoader(TextureLoader, 'venus-texture.jpg');
  const EARTH_MAP = useLoader(TextureLoader, 'earth-texture.jpg');

  const CAMERA_REF = useRef();
  const CONTROLS_REF = useRef();
  const RESET_TWEEN = useRef(null);

  const [PLANET_POSITION, setPlanetPosition] = useState({});
  const [PLANET_ANGLE, setPlanetAngle] = useState({});
  const [PLANET_RADIUS, setPlanetRadius] = useState({});
  const [PLANET_SIZE, setPlanetSize] = useState({});

  const [IS_RESETTING, setIsResetting] = useState(false);
  const [IS_ORBITAL_RING_VISIBLE, setIsOrbitalRingVisible] = useState(true);
  const [SPEED, setSpeed] = useState(DEFAULT_SPEED);
  const [FOCUSED_PLANET, setFocusedPlanet] = useState(null);
  
  const { BASE_SCALE, PLANET_CAMERA } = SOLAR_SYSTEM;

  const updatePlanetPosition = useCallback((name, position, size, angle, radius) => {
    setPlanetPosition(prev => ({...prev, [name]: position}));
    setPlanetSize(prev => ({...prev, [name]: size}));
    setPlanetAngle(prev => ({...prev, [name]: angle}));
    setPlanetRadius(prev => ({...prev, [name]: radius}));
  }, []);

  //Camera follows fosuced planet
  useEffect(() => {
    if (CAMERA_REF.current && CONTROLS_REF.current && !IS_RESETTING && FOCUSED_PLANET && FOCUSED_PLANET !== "Sun") {
      
      const position = PLANET_POSITION[FOCUSED_PLANET];
      const angle = PLANET_ANGLE[FOCUSED_PLANET];
      const radius = PLANET_RADIUS[FOCUSED_PLANET];
      const size = PLANET_SIZE[FOCUSED_PLANET];
      
      CAMERA_REF.current.position.set(
        Math.cos(angle.current) * (radius + (size / BASE_SCALE) * PLANET_CAMERA.DISTANCE_MULTIPLIER),  
        position.y + ((size / BASE_SCALE) * PLANET_CAMERA.HEIGHT_MULTIPLIER), 
        Math.sin(angle.current) * (radius + (size / BASE_SCALE) * PLANET_CAMERA.DISTANCE_MULTIPLIER) 
      );
  
      CONTROLS_REF.current.target.set(
        position.x,
        position.y,
        position.z
      );
  
      CONTROLS_REF.current.update();
    }
  },);

  //Camera reset transition
  const handleResetCamera = () => {
    if (CAMERA_REF.current && CONTROLS_REF.current && !IS_RESETTING) {
      setIsResetting(true);
      setFocusedPlanet(null);
  
      const tl = gsap.timeline({
        onUpdate: () => {
          CONTROLS_REF.current.update();
        },
        onComplete: () => {
          setIsResetting(false);
        }
      });
  
      tl.to(CAMERA_REF.current.position, {
        x: CAMERA.DEFAULT_POSITION.x,
        y: CAMERA.DEFAULT_POSITION.y,
        z: CAMERA.DEFAULT_POSITION.z,
        duration: CAMERA.TRANSITION_DURATION,
        ease: CAMERA.TRANSITION_EASE,
      }, 0)

      .to(CONTROLS_REF.current.target, {
        x: CAMERA.DEFAULT_TARGET.x,
        y: CAMERA.DEFAULT_TARGET.y,
        z: CAMERA.DEFAULT_TARGET.z,
        duration: CAMERA.TRANSITION_DURATION,
        ease: CAMERA.TRANSITION_EASE,
      }, 0);
  
      RESET_TWEEN.current = tl;
    }
  };

  //Camera focus transition
  const handlePlanetClick = useCallback((name, position, size, angle, radius) => {
    if (CAMERA_REF.current && CONTROLS_REF.current) {
      setIsResetting(true);
      setFocusedPlanet(name);
      setSpeed(0);

      const cameraOffset = {
        x: Math.cos(angle.current) * (radius + (size / BASE_SCALE) * PLANET_CAMERA.DISTANCE_MULTIPLIER),  
        y: position.y + ((size / BASE_SCALE) * PLANET_CAMERA.HEIGHT_MULTIPLIER), 
        z: Math.sin(angle.current) * (radius + (size / BASE_SCALE) * PLANET_CAMERA.DISTANCE_MULTIPLIER) 
      };
      
      const tl = gsap.timeline({
        onUpdate: () => {
          CONTROLS_REF.current.update();
        },
        onComplete: () => {
          setIsResetting(false);
          setSpeed(DEFAULT_SPEED);
        }
      });
      
      if (name === "Sun") {
        tl.to(CAMERA_REF.current.position, {
          x: position.x,
          y: position.y + SOLAR_SYSTEM.SUN.CAMERA_OFFSET.y,
          z: position.z + SOLAR_SYSTEM.SUN.CAMERA_OFFSET.z,  
          duration: CAMERA.TRANSITION_DURATION,
          ease: CAMERA.TRANSITION_EASE,
        }, 0)

        .to(CONTROLS_REF.current.target, {
          x: position.x,
          y: position.y,
          z: position.z,
          duration: CAMERA.TRANSITION_DURATION,
          ease: CAMERA.TRANSITION_EASE,
        }, 0);
      }

      else {
        tl.to(CAMERA_REF.current.position, {
          x: cameraOffset.x,
          y: cameraOffset.y,
          z: cameraOffset.z,
          duration: CAMERA.TRANSITION_DURATION,
          ease: CAMERA.TRANSITION_EASE,
        }, 0)

        .to(CONTROLS_REF.current.target, {
          x: position.x,
          y: position.y,
          z: position.z,
          duration: CAMERA.TRANSITION_DURATION,
          ease: CAMERA.TRANSITION_EASE,
        }, 0);
      }
      
      RESET_TWEEN.current = tl;
    }
  },);

  //Toggle Orbital ring visibility
  const handleToggleOrbitalRing = () => {
    setIsOrbitalRingVisible((prev) => !prev);
  };

  return (
    <div>
      <nav className="navbar">

        <span className="navname">🌌 3D Interactive Solar System Explorer</span>

        <button className="reset-button" onClick={handleResetCamera}>
          {IS_RESETTING ? 'Camera\'s Moving...' : 'Reset Camera'}  
        </button>

        <button className="toggle-button" onClick={handleToggleOrbitalRing}>
          {IS_ORBITAL_RING_VISIBLE ? 'Hide Orbital Rings' : 'Show Orbital Rings'}
        </button>

        <div className="speed">
          <span className="speed-value">Speed x{SPEED}</span>
          <input className='speed-slider'
            type="range" 
            min="0" 
            max={SPEED_OPTIONS.length - 1} 
            step="1" 
            value={SPEED_OPTIONS.indexOf(SPEED)}
            onChange={(e) => setSpeed(SPEED_OPTIONS[parseInt(e.target.value)])}
          />
        </div>

        <div className="focused-planet">
          Following : {FOCUSED_PLANET ? FOCUSED_PLANET : 'None'}
        </div>

      </nav>

      <span className="camera-tip1">Left-click & drag to rotate the camera.</span>
      <span className="camera-tip2">Right-click & drag to pan the camera.</span>
      <span className="camera-tip3">Scroll wheel to zoom in & out.</span>    

      <Canvas>

        <Camera 
          cameraRef={CAMERA_REF} 
          controlsRef={CONTROLS_REF} 
          onUserControlStart={() => {
            if (RESET_TWEEN.current) {
              RESET_TWEEN.current.kill();
              RESET_TWEEN.current = null;
            }
            setIsResetting(false);
            setFocusedPlanet(null);
          }}
        />

        <pointLight position={[0, 0, 0]} intensity={1500} />
        <ambientLight intensity={0.25} />

        <Suspense fallback={null}>
          
          {/* Sun */}
          <Sun 
            size={BASE_SCALE * SOLAR_SYSTEM.SUN.SIZE_MULTIPLIER} 
            textureMap={SUN_MAP} 
            speed={SPEED} 
            rotationalScale={SOLAR_SYSTEM.SUN.ROTATIONAL_SCALE}
            focusedPlanet={FOCUSED_PLANET}
            onPlanetClick={handlePlanetClick}
          />

          {/* Mercury */}
          <Planet 
            name="Mercury"
            size={BASE_SCALE * SOLAR_SYSTEM.PLANETS.MERCURY.SIZE_MULTIPLIER} 
            textureMap={MERCURY_MAP} 
            speed={SPEED} 
            rotationalScale={SOLAR_SYSTEM.PLANETS.MERCURY.ROTATIONAL_SCALE}
            orbitalScale={1 / SOLAR_SYSTEM.PLANETS.MERCURY.ORBITAL_PERIOD}
            radius={BASE_SCALE * SOLAR_SYSTEM.PLANETS.MERCURY.RADIUS_MULTIPLIER} 
            isObitalRingVisible={IS_ORBITAL_RING_VISIBLE}
            focusedPlanet={FOCUSED_PLANET}
            onPlanetClick={handlePlanetClick}
            updatePosition={(position, size, angle, radius) => 
              updatePlanetPosition("Mercury", position, size, angle, radius)}
          />

          {/* Venus */}
          <Planet 
            name="Venus"
            size={BASE_SCALE * SOLAR_SYSTEM.PLANETS.VENUS.SIZE_MULTIPLIER} 
            textureMap={VENUS_MAP} 
            speed={SPEED} 
            rotationalScale={SOLAR_SYSTEM.PLANETS.VENUS.ROTATIONAL_SCALE} 
            orbitalScale={1 / SOLAR_SYSTEM.PLANETS.VENUS.ORBITAL_PERIOD} 
            radius={BASE_SCALE * SOLAR_SYSTEM.PLANETS.VENUS.RADIUS_MULTIPLIER} 
            isObitalRingVisible={IS_ORBITAL_RING_VISIBLE}
            focusedPlanet={FOCUSED_PLANET}
            onPlanetClick={handlePlanetClick}
            updatePosition={(position, size, angle, radius) => 
              updatePlanetPosition("Venus", position, size, angle, radius)}
          />

          {/* Earth */}
          <Planet 
            name="Earth"
            size={BASE_SCALE * SOLAR_SYSTEM.PLANETS.EARTH.SIZE_MULTIPLIER} 
            textureMap={EARTH_MAP} 
            speed={SPEED} 
            rotationalScale={SOLAR_SYSTEM.PLANETS.EARTH.ROTATIONAL_SCALE} 
            orbitalScale={1 / SOLAR_SYSTEM.PLANETS.EARTH.ORBITAL_PERIOD} 
            radius={BASE_SCALE * SOLAR_SYSTEM.PLANETS.EARTH.RADIUS_MULTIPLIER} 
            isObitalRingVisible={IS_ORBITAL_RING_VISIBLE}
            focusedPlanet={FOCUSED_PLANET}
            onPlanetClick={handlePlanetClick}
            updatePosition={(position, size, angle, radius) => 
              updatePlanetPosition("Earth", position, size, angle, radius)}
          />

        </Suspense>
        
      </Canvas>

      <PlanetInfo 
        focusedPlanet={FOCUSED_PLANET} 
      />

    </div>
  );
};

export default App;