import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface StlRenderProps {
    stlFile: File | null;
    color?: string | number | undefined; 
}

export default function STLRender(props: StlRenderProps) {
    const viewerRef = useRef<HTMLDivElement>(null);
    let camera: THREE.PerspectiveCamera;
    let controls: OrbitControls;

    const renderSTLModel = (file: Blob) => {
        const scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(450, 450);
        viewerRef.current!.innerHTML = ''; 
        viewerRef.current!.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;
        controls.update();

        const loader = new STLLoader();
        const reader = new FileReader();
        reader.onload = (event) => {
            const contents = event.target!.result as ArrayBuffer;
            const geometry = loader.parse(contents);
            geometry.center(); 

           
            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox!;
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            const maxDimension = Math.max(size.x, size.y, size.z);
            const fitOffset = 1.25; 
            camera.position.z = maxDimension * fitOffset; 
  
            const material = new THREE.MeshPhongMaterial({ color: props.color || 0x4a90e2, shininess: 100 });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            mesh.rotation.x = -0.5 * Math.PI; // Rotate for a better initial view

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();
        };

        reader.readAsArrayBuffer(file);
    };

    const handleZoom = (zoomIn: boolean) => {
        if (camera) {
            camera.position.z += zoomIn ? -5 : 5;
            camera.updateProjectionMatrix();
        }
    };

    useEffect(() => {
        if (props.stlFile) {
            renderSTLModel(props.stlFile);
        }
    }, [props.stlFile]);
    useEffect(() => {
      if(props.stlFile)
      renderSTLModel(props.stlFile);
    }, [props.color]);
    return (
      <div className="relative bg-gray-50 rounded-lg shadow-inner flex items-center justify-center h-[450px]">
      <div ref={viewerRef} className="w-full h-full flex justify-center" />
      <div className="absolute bottom-10 right-44">
        <div className='flex flex-col items-center space-y-2'>
          <button onClick={() => handleZoom(true)} className="bg-transparent text-white rounded-full shadow hover:bg-blue-300">
            <img
              src='/plus.svg'
              className="w-10 h-10 object-contain transform"
            />
          </button>
          <button onClick={() => handleZoom(false)} className="bg-transparent text-white rounded-full shadow hover:bg-blue-300">
            <img
              src='/minus.svg'
              className="w-10 h-10 object-contain transform"
            />
          </button>
        </div>
      </div>
    </div>
    )
}
