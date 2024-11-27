import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
const calculateMetrics = async (file: Blob, setLoading: (val: boolean) => void, infillDensity: number, setPrintTime: (arg0: string) => void, setCost: (arg0: string) => void, setError: (arg0: string) => void   ) => {
    setLoading(true);
    if(( file instanceof Blob)){
    const reader = new FileReader();
    reader.onload = (event) => {
      if(!event.target) return;
      const contents = event.target.result;
        calcVars(contents, setLoading, infillDensity, setPrintTime, setCost, setError)
    };
    await reader.readAsArrayBuffer(file);
    }
    
  };
async function backendCalculateMetrics(file: ArrayBuffer, setLoading: (val: boolean) => void, infillDensity: number, setPrintTime: (arg0: string) => void, setCost: (arg0: string) => void, setError: (arg0: string) => void) {
    calcVars(file, setLoading, infillDensity, setPrintTime, setCost, setError)
    return;
}
function calcVars(contents: any, setLoading: any, infillDensity: any, setPrintTime: any, setCost: any, setError: any) {
    const loader = new STLLoader();
    console.log(typeof contents)
      try {
        const geometry = loader.parse(contents || '');

        // Calculate volume
        const volume = calculateVolume(geometry);

        // Parameters for calculations
        const printSpeed = 25000; // mm/hour
        const materialCostPerCc = 0.000025; // Cost per cubic centimeter

        // Calculate volume used based on infill density
        const effectiveVolume = volume * (infillDensity / 100);

        // Calculate print time and cost
        const printTimeHours = effectiveVolume / printSpeed;
        const costAmount = effectiveVolume * materialCostPerCc;

        setPrintTime(printTimeHours.toFixed(2));
        setCost(costAmount.toFixed(2));
      } catch (err) { 
        console.error(err);
        setError('Failed to parse the STL file. Please ensure it is a valid file.');
      } finally {
        setLoading(false);
      }
}
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

export default calculateMetrics;
export { backendCalculateMetrics };