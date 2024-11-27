declare module 'three/examples/js/loaders/STLLoader' {
    import { Loader } from 'three';
    import { Geometry } from 'three';

    export class STLLoader extends Loader {
        constructor();

        load(url: string, onLoad: (geometry: Geometry) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
        parse(data: ArrayBuffer): Geometry;
    }
}
