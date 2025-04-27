import { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';

const Sun = ({ size, textureMap, speed, rotationalScale, onPlanetClick, focusedPlanet }) => {
    const ref = useRef();
    const ringRef = useRef();
    const [hovered, setHovered] = useState(false);
    const { camera } = useThree();

    useCursor(hovered);

    useFrame((state, delta) => {
        if (speed !== 0) {
            ref.current.rotation.y += delta * rotationalScale * speed;
        }
        if (ringRef.current) {
            ringRef.current.lookAt(camera.position);
        }
    });

    const handleClick = () => {
        if (onPlanetClick) {
            onPlanetClick("Sun", { x: 0, y: 0, z: 0 }, size, 0, 1);
        }
    };

    return (
        <group position={[0, 0, 0]} ref={ref}>
            {/* Sun mesh */}
            <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={handleClick}
            >
                <sphereGeometry args={[size, 64, 64]} />
                <meshBasicMaterial map={textureMap} />
            </mesh>

            {/* Highlight when Hovered */}
            {(hovered || focusedPlanet === "Sun") && (
            <mesh rotation={[Math.PI / 2, 0, 0]} ref={ringRef}>
                <torusGeometry args={[size * 1, size * 0.1, 2, 64]} />
                <meshBasicMaterial color="yellow"/>
            </mesh>
            )}
        </group>
    );
};

export default Sun;