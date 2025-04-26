import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

const Camera = ({ cameraRef, controlsRef, onUserControlStart }) => {  
    return (
        <>
            <PerspectiveCamera 
                ref={cameraRef} 
                makeDefault 
                position={[0, 15, 30]} 
                fov={60} />
            <OrbitControls 
                ref={controlsRef} 
                zoomSpeed={1} 
                rotateSpeed={0.5} 
                panSpeed={0.5}
                onStart={onUserControlStart}
            />
        </>
    );
}

export default Camera;