import { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';

import { SOLAR_SYSTEM } from './Data';

const Planet = ({ 
  size, 
  textureMap, 
  speed, 
  rotationalScale, 
  orbitalScale, 
  radius, 
  initialAngle = 0, 
  isObitalRingVisible, 
  name, 
  focusedPlanet,
  onPlanetClick,
  updatePosition
}) => {
    const REF = useRef();
    const RING_REF = useRef();
    const ANGLE = useRef(initialAngle);
    const [HOVERED, setHovered] = useState(false);

    const { PLANET_GEOMETRY, ORBITAL_RING } = SOLAR_SYSTEM;
    const { camera } = useThree();

    useCursor(HOVERED);

    useFrame((state, delta) => {
        if (speed !== 0) {
            REF.current.rotation.y += delta * rotationalScale * speed;
            ANGLE.current += delta * orbitalScale * speed * -1;
            REF.current.position.x = Math.cos(ANGLE.current) * radius;
            REF.current.position.z = Math.sin(ANGLE.current) * radius;
        }

        const position = {
            x: REF.current.position.x,
            y: REF.current.position.y,
            z: REF.current.position.z
        };
        updatePosition(position, size, ANGLE, radius);

        if (RING_REF.current) {
            RING_REF.current.lookAt(camera.position);
        }
    });

    const handleClick = () => {
        if (onPlanetClick) {
            const position = {
                x: REF.current.position.x,
                y: REF.current.position.y,
                z: REF.current.position.z
            };
            onPlanetClick(name, position, size, ANGLE, radius);
        }
    };

    return (
        <>
            <group ref={REF}>

                {/* planet mesh */}
                
                <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={handleClick}
                >
                    <sphereGeometry args={[size, PLANET_GEOMETRY.SEGMENTS, PLANET_GEOMETRY.SEGMENTS]} />
                    <meshStandardMaterial map={textureMap} />

                </mesh>

                {/* highlight when hovered of focused */}

                {(HOVERED || focusedPlanet === name) && (
                <mesh rotation={[Math.PI / 2, 0, 0]} ref={RING_REF}>

                    <torusGeometry 
                        args={[
                            size * PLANET_GEOMETRY.HIGHLIGHT_RING.SIZE_MULTIPLIER, 
                            size * PLANET_GEOMETRY.HIGHLIGHT_RING.THICKNESS_MULTIPLIER, 
                            PLANET_GEOMETRY.HIGHLIGHT_RING.SEGMENTS.RADIAL, 
                            PLANET_GEOMETRY.HIGHLIGHT_RING.SEGMENTS.TUBULAR
                        ]} 
                    />
                    <meshBasicMaterial color="gray"/>

                </mesh>
                )}
                
            </group>

            {/* Orbital Ring */}

            {isObitalRingVisible && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>

                <torusGeometry 
                    args={[
                        radius - ORBITAL_RING.WIDTH / 2, 
                        ORBITAL_RING.WIDTH + ORBITAL_RING.WIDTH / 2, 
                        ORBITAL_RING.SEGMENTS.RADIAL, 
                        ORBITAL_RING.SEGMENTS.TUBULAR
                    ]} 
                />
                <meshBasicMaterial color="white" opacity={0.25} transparent />

            </mesh>)
            }
        </>
    );
};

export default Planet;