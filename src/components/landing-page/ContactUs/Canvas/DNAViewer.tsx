import React from 'react';
import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type GLTFResult = {
  scene: THREE.Group;
  nodes: { [key: string]: THREE.Object3D };
  materials: { [key: string]: THREE.Material };
};

const DNA: React.FC = () => {
  const { scene } = useGLTF('/DNA/dnaModel.glb') as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      const boundingBox = new THREE.Box3().setFromObject(groupRef.current);
      const boxCenter = boundingBox.getCenter(new THREE.Vector3());
      groupRef.current.position.sub(boxCenter);

    }
  }, [scene]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={0.1} />
    </group>
  );
};

const DNAViewer: React.FC = () => {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={300}
          maxDistance={350}
        />
        
        <ambientLight intensity={0.8} /> 
        
        <directionalLight position={[200, 200, 200]} intensity={1.5} /> 
        
        <PerspectiveCamera
          makeDefault
          position={[0, 1, 10]}
          fov={60}
          near={0.1}
          far={1000}
        />

        <DNA />
      </Suspense>
    </Canvas>
  );
};

export default DNAViewer;
