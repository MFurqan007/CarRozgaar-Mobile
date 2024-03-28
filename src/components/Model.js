"use client"
import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model = ({ modelPath }) => {
  const gltf = useLoader(GLTFLoader, modelPath);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  return <primitive object={gltf.scene} dispose={null} />;
};

export default Model;