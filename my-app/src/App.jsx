import { Canvas } from '@react-three/fiber'
import './App.css'
import { DirectionalLight } from 'three/src/Three.Core.js'

const App = () => {
  return (
    <Canvas>
      <directionalLight position={[0, 0, 2]}/>
      <mesh position={[1, -1, 0]}> 
        <boxGeometry />
        <meshStandardMaterial color={"orange"}/>
      </mesh>

      <mesh position={[-1, -1, 0]}> 
        <boxGeometry />
        <meshStandardMaterial color={"orange"}/>
      </mesh>

      <mesh position={[1, 1, 0]}> 
        <boxGeometry />
        <meshStandardMaterial color={"orange"}/>
      </mesh>

      <mesh position={[-1, 1, 0]}> 
        <boxGeometry />
        <meshStandardMaterial color={"orange"}/>
      </mesh>

    </Canvas>
  )
}

export default App
