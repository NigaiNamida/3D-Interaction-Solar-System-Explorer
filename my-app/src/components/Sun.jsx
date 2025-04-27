import { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';

import { SOLAR_SYSTEM } from './Data';

const Sun = ({ size, textureMap, speed, rotationalScale, onPlanetClick, focusedPlanet }) => {
    const REF = useRef();
    const RING_REF = useRef();
    const [HOVERED, setHovered] = useState(false);
    const { camera } = useThree();

    const { SUN } = SOLAR_SYSTEM;

    useCursor(HOVERED);

    useFrame((state, delta) => {
        if (speed !== 0) {
            REF.current.rotation.y += delta * rotationalScale * speed;
        }
        if (RING_REF.current) {
            RING_REF.current.lookAt(camera.position);
        }
    });

    const handleClick = () => {
        if (onPlanetClick) {
            onPlanetClick("Sun", { x: 0, y: 0, z: 0 }, size, 0, 1);
        }
    };

    return (
        <group position={[0, 0, 0]} ref={REF}>

            {/* Sun mesh */}

            <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={handleClick}
            >

                <sphereGeometry args={[size, SUN.GEOMETRY_SEGMENTS, SUN.GEOMETRY_SEGMENTS]}/>
                <meshBasicMaterial map={textureMap}/>

            </mesh>

            {/* Highlight when Hovered */}
            
            {(HOVERED || focusedPlanet === "Sun") && (
            <mesh rotation={[Math.PI / 2, 0, 0]} ref={RING_REF}>

                <torusGeometry args={[
                    size * SUN.HIGHLIGHT_RING.SIZE_MULTIPLIER, 
                    size * SUN.HIGHLIGHT_RING.THICKNESS_MULTIPLIER, 
                    SUN.HIGHLIGHT_RING.SEGMENTS.RADIAL, 
                    SUN.HIGHLIGHT_RING.SEGMENTS.TUBULAR
                ]}/>
                <meshBasicMaterial color="gray"/>

            </mesh>
            )}

        </group>
    );
};

export default Sun;