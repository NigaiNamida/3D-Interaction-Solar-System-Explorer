import { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useCursor } from '@react-three/drei';

const Planet = ({ 
  size, 
  textureMap, 
  speed, 
  rotationalScale, 
  orbitalScale, 
  radius, 
  orbitalRingWidth = 0.015, 
  initialAngle = 0, 
  ring, 
  name, 
  onPlanetClick 
}) => {
    const ref = useRef();
    const ringRef = useRef();
    const angle = useRef(initialAngle);
    const [hovered, setHovered] = useState(false);
    const { camera } = useThree();

    useCursor(hovered);

    useFrame((state, delta) => {
        if (speed !== 0) {
            ref.current.rotation.y += delta * rotationalScale * speed;
            angle.current += delta * orbitalScale * speed * -1;
            ref.current.position.x = Math.cos(angle.current) * radius;
            ref.current.position.z = Math.sin(angle.current) * radius;
        }

        if (ringRef.current) {
            ringRef.current.lookAt(camera.position);
        }
    });

    const handleClick = () => {
        if (onPlanetClick) {
            const position = {
                x: ref.current.position.x,
                y: ref.current.position.y,
                z: ref.current.position.z
            };
            onPlanetClick(name, position);
        }
    };

    return (
        <>
            <group ref={ref}>
                {/* planet mesh */}
                <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={handleClick}
                >
                    <sphereGeometry args={[size, 64, 64]} />
                    <meshStandardMaterial map={textureMap} />
                </mesh>

                {/* Highlight when Hovered */}
                {(hovered) && (
                <mesh rotation={[Math.PI / 2, 0, 0]} ref={ringRef}>
                    <torusGeometry args={[size * 1, size * 0.5, 2, 64]} />
                    <meshBasicMaterial color="white" opacity={0.75} transparent />
                </mesh>
                )}
            </group>

            {/* Orbital Ring */}
            {ring && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius - orbitalRingWidth / 2, orbitalRingWidth + orbitalRingWidth / 2, 16, 128]} />
                <meshBasicMaterial color="white" opacity={0.25} transparent />
            </mesh>)
            }
        </>
    );
};

export default Planet;