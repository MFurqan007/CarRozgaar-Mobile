// "use client"
// import React from 'react';
// import { Canvas } from '@react-three/fiber';
// import { useGLTF, OrbitControls } from '@react-three/drei';
// import Mehran from '../../../../../public/models/Mehran.glb'

// function Model({ path }) {
//   const { scene } = useGLTF(path);
//   return <primitive object={scene} />;
// }

// export default function page() {
//   return (
//     <Canvas>
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//       <pointLight position={[-10, -10, -10]} />
//       <Model path={Mehran} />
//       <OrbitControls />
//     </Canvas>
//   );
// }

// pages/model-page.js
"use client"
import dynamic from 'next/dynamic';
import React, { Suspense, use, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Model = dynamic(() => import('../../../../components/Model'), { ssr: false });

export default function ModelPage() {
  const [paths, setPaths] = useState(["/models/Mehran1.blend.glb", "/models/Mehran2.glb", "/models/Mehran3.glb"])
  const [model, setModel] = useState("/models/Mehran1.blend.glb")
  return (
    <div className='w-[100%] h-[100vh] mt-5 flex justify-start items-center'>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">Click</div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          {
            paths.map((path, index) => (
              <li key={index} onChange={()=>setModel(path)}>M</li>
            ))
          }
        </ul>
      </div>
      <div className='w-full h-[70vh] border-2 border-black'>
        <Canvas
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Model modelPath={model} />
          </Suspense>
          {/* <OrbitControls enableZoom={true} maxPolarAngle={Math.PI} minPolarAngle={0} autoRotate autoRotateSpeed={1.0}/> */}
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
}
