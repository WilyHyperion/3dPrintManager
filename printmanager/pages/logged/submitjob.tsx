import { useState, useRef, useEffect } from 'react';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import STLRender from '@/components/stlRender';
import { pass } from 'three/webgpu';
import { FilterTypes } from '@/types/Filters';
import { colors, printers} from "@/types/Constants"
import Header from '@/components/header';

export default function STLModelUploader() {
  const [file, setFile] = useState(null as Blob | null);
  const [printTime, setPrintTime] = useState(null as string | null);
  const [cost, setCost] = useState(null as string | null);
  const [loading, setLoading] = useState(false as boolean);
  const [error, setError] = useState('' );
  const [color, setColor] = useState(undefined as string | number | undefined);
  const [infillDensity, setInfillDensity] = useState('20'); // Default to 20% infill
  const handleFileChange = (event: { target: { files: any[]; }; }) => {
    const selectedFile = event.target.files[0];
    

    if (selectedFile && selectedFile.name.endsWith('.stl')) {
      setFile(selectedFile);
      calculateMetrics(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid STL file.');
    }
  };
  const calculateMetrics = (file: Blob) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result;
      const loader = new STLLoader();

      try {
        const geometry = loader.parse(contents as  any);

        // Calculate volume
        const volume = calculateVolume(geometry);

        // Parameters for calculations
        const printSpeed = 25000; // mm/hour
        const materialCostPerCc = 0.000025; // Cost per cubic centimeter

        // Calculate volume used based on infill density
        const effectiveVolume = volume * ((infillDensity as any) / 100);

        // Calculate print time and cost
        const printTimeHours = effectiveVolume / printSpeed;
        const costAmount = effectiveVolume * materialCostPerCc;

        setPrintTime(printTimeHours.toFixed(2));
        setCost(costAmount.toFixed(2));
      } catch (err) {
        setError('Failed to parse the STL file. Please ensure it is a valid file.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  

  const calculateVolume = (geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>) => {
    let volume = 0;
    const faces = geometry.attributes.position.count;

    for (let i = 0; i < faces; i += 3) {
      const a = new THREE.Vector3(
        geometry.attributes.position.getX(i),
        geometry.attributes.position.getY(i),
        geometry.attributes.position.getZ(i)
      );

      const b = new THREE.Vector3(
        geometry.attributes.position.getX(i + 1),
        geometry.attributes.position.getY(i + 1),
        geometry.attributes.position.getZ(i + 1)
      );

      const c = new THREE.Vector3(
        geometry.attributes.position.getX(i + 2),
        geometry.attributes.position.getY(i + 2),
        geometry.attributes.position.getZ(i + 2)
      );

      volume += (1 / 6) * Math.abs(a.dot(b.cross(c)));
    }



    return Math.abs(volume);
  };
  useEffect(() => {
    if (file) {
      calculateMetrics(file);
    }
  }, [infillDensity]);

  const recalculateMetrics = () => {
    if (file) {
      calculateMetrics(file);
    } else {
      setError('No file available for recalculation. Please upload a file first.');
    }
  };

  return (
    
    <div>
      <Header/>
      <div className="flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-800 to-purple-900 w-screen h-screen">
      
        <div className="grid grid-cols-2 gap-8 p-10 bg-white rounded-lg shadow-xl max-w-5xl">
          <form className="flex flex-col space-y-6"   action="/api/jobsubmit" method="post" encType="multipart/form-data" onSubmit = {
            (e) => {
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              if(!file){
                setError('Please upload a valid STL file.');
                e.preventDefault();
                return;
              }
              if(!formData.get("name")){
                setError('Please enter a model name.');
                e.preventDefault();
                return;
              }
              if(!formData.get("color") || formData.get("color") === "Select Material"){
                setError('Please select a color.');
                e.preventDefault();
                return;
              }
              if(!formData.get("printer") || formData.get("printer") === "Select Printer"){
                setError('Please select a printer.');
                e.preventDefault();
                return;
              }
              if(!formData.get("inFillPercentage")){
                formData.set("inFillPercentage", "20");
              }
              if(!formData.get("notes")){
                formData.set("notes", "");
              }
             
            } 
          }>
            <h2 className="text-3xl font-semibold text-gray-700">Upload STL Model</h2>
            <input
              name="file"
              type="file"
              accept=".stl"
              onChange={handleFileChange as any}
              className="file-input file-input-bordered w-full mb-4 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500"
              required
            />
            <div>
            <text className="text-black -mb-4">
              Infill Density (defualt 20%)
            </text>
            <input
              type="number"
              value={infillDensity}
              onChange={(e) => {
                setInfillDensity(e.target.value);
                recalculateMetrics();
              }}
              className="input input-bordered w-full mb-4 p-2 border-2 text-black border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              min="0"
              max="100"
              placeholder="Infill Density (%)"
              name="inFillPercentage"
            />
            </div>
            {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
            {loading && <p className="text-gray-500">Calculating...</p>}
            {printTime !== null && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                <p className="text-gray-700 font-medium">Estimated Print Time: <span className="text-purple-700">{printTime} hours</span></p>
                <p className="text-gray-700 font-medium">Estimated Cost: <span className="text-purple-700">${cost}</span></p>
              </div>
            )}
            <input type="text" name="name" placeholder="Enter Model Name"  required className="input text-black input-bordered w-full mb-4 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"  />
            <div className="relative">
            <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                name="color"
                onChange={(e) => {
                  console.log(e.target.value)
                  setColor(e.target.value)}}
              >
                {colors.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <div className="relative">
            <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-state"
                name="printer"
                required
              >
                {printers.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <textarea  name="notes" placeholder="Enter Special Requests" className="input text-black text-wrap input-bordered w-full h-auto mb-4 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"/>
            <button type="submit" className="btn btn-primary bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg px-4 py-2">Submit</button>
          </form>
         <STLRender stlFile = {file as any} color={color}  />
        </div>
      </div>
    </div>
  );
}
