import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import { CAMERA } from './Data';

const Camera = ({ cameraRef, controlsRef, onUserControlStart }) => {  

    const { DEFAULT_POSITION, FOV, CONTROLS } = CAMERA;
    
    return (
        <>
            <PerspectiveCamera 
                ref={cameraRef} 
                makeDefault 
                position={[DEFAULT_POSITION.x, DEFAULT_POSITION.y, DEFAULT_POSITION.z]} 
                fov={FOV} 
            />

            <OrbitControls 
                ref={controlsRef} 
                zoomSpeed={CONTROLS.ZOOM_SPEED} 
                rotateSpeed={CONTROLS.ROTATE_SPEED} 
                panSpeed={CONTROLS.PAN_SPEED}
                onStart={onUserControlStart}
            />
        </>
    );
}

export default Camera;