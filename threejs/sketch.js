import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

const cameraP = {fov: 90, aspect: 2, near: 0.1, far: 30};
const camera = new THREE.PerspectiveCamera(cameraP.fov, cameraP.aspect, cameraP.near, cameraP.far);

camera.position.z = 1

const scene = new THREE.Scene();


// const geometry = new THREE.BoxGeometry(10, 10, 10);

// const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue

// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);


const loader = new GLTFLoader();

loader.load(
    '../Resources/Blender/tank.glb',
    
    function ( gltf ) {
        const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue

        scene.add( gltf.scene );
        console.log("Tank loaded");
    },
    function ( xhr ) { // called while loading is progressing
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) { // error
        console.error( error );
    } 
);


function animate(time) {
    // time *= 0.001;  // seconds
    // time *= 0.01;  // seconds
  
    // cube.rotation.x = Math.cos(time * 0.5);
    // cube.rotation.y = time * 0.5;
    // cube.rotation.y = time * 1;

    camera.position.z += time;
    // console.log(camera.position.z)
  
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
  
requestAnimationFrame(animate);

// Change canvas size based on window
$(window).resize(resizeTextSize); // When screen size change, adjust text size
resizeTextSize();

function resizeTextSize() {
    const canvas = renderer.domElement;
    
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // update any render target sizes here
    }
}