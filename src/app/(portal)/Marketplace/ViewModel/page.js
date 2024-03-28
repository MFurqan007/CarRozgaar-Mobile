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
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Model = dynamic(() => import('../../../../components/Model'), { ssr: false });

export default function ModelPage() {
  return (
    <div className='w-[100%] h-[100vh] flex justify-center items-center'>
      <div className='w-4/6 h-[80vh] border-2 border-black'>
        <Canvas
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Model modelPath="/models/Mehran.glb" />
          </Suspense>
          {/* <OrbitControls enableZoom={true} maxPolarAngle={Math.PI} minPolarAngle={0} autoRotate autoRotateSpeed={1.0}/> */}
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
}
