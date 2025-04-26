import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { FirstPersonControls } from "@react-three/drei";
import './App.css'
import { useRef, Suspense  } from 'react'
import { TextureLoader } from 'three'

const Planet = ({position, size, colorMap, rotationalSpeed}) => {
  
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * rotationalSpeed
  })

  return (
      <mesh position = {position} ref = {ref}> 
        <sphereGeometry args = {size}/>
        <meshStandardMaterial map = {colorMap}/>
      </mesh>
  )
}

const Sun = ({position, size, colorMap, rotationalSpeed}) => {
  
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * rotationalSpeed
  })

  return (
      <mesh position = {position} ref = {ref}> 
        <sphereGeometry args = {size}/>
        <meshBasicMaterial map = {colorMap}/>
      </mesh>
  )
}

const Camera = () => {}

const App = () => {

  const sunMap = useLoader(TextureLoader, 'sun-texture.jpg')
  const mercuryMap = useLoader(TextureLoader, 'mercury-texture.jpg')
  const venusMap = useLoader(TextureLoader, 'venus-texture.jpg')
  const earthMap = useLoader(TextureLoader, 'earth-texture.jpg')
  const rotationalScale = 0.5
  const baseScale = 0.1

  return (
    <Canvas>
      <Suspense fallback={null}>
        <FirstPersonControls/>
        <directionalLight position={[-10, 0, 0]} intensity={5}/>
        <ambientLight intensity={0.5}/>

        <Sun position = {[0, 1, 0]} size = {[baseScale * 10, 64, 64]} colorMap = {sunMap} rotationalSpeed = {rotationalScale * 0.04}/>

        <Planet position = {[-2, -1, 0]} size = {[baseScale * 0.38, 64, 64]} colorMap = {mercuryMap} rotationalSpeed = {rotationalScale * 0.017}/>
        <Planet position = {[0, -1, 0]} size = {[baseScale * 0.95, 64, 64]} colorMap = {venusMap} rotationalSpeed = {rotationalScale * -0.0041}/>
        <Planet position = {[2, -1, 0]} size = {[baseScale * 1, 64, 64]} colorMap = {earthMap} rotationalSpeed = {rotationalScale * 1}/>

      </Suspense>
    </Canvas>
  )
}


export default App
