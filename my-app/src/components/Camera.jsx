import { PerspectiveCamera, OrbitControls } from '@react-three/drei';

import { CAMERA_SETTINGS } from './Data';

const Camera = ({ cameraRef, controlsRef, onUserControlStart }) => {  
    const { POSITION, FOV, CONTROLS } = CAMERA_SETTINGS;
    
    return (
        <>
            <PerspectiveCamera 
                ref={cameraRef} 
                makeDefault 
                position={[POSITION.x, POSITION.y, POSITION.z]} 
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