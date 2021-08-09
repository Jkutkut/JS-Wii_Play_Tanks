// "use strict";

// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

// // function main() {
// //   const canvas = document.querySelector('#canvas');
// //   const renderer = new THREE.WebGLRenderer({canvas});

// //   const fov = 75;
// //   const aspect = 2;  // the canvas default
// //   const near = 0.1;
// //   const far = 5;
// //   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// //   camera.position.z = 2;

// //   const scene = new THREE.Scene();

// //   const boxWidth = 1;
// //   const boxHeight = 1;
// //   const boxDepth = 1;
// //   const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// //   const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue

// //   const cube = new THREE.Mesh(geometry, material);
// //   scene.add(cube);

// //   renderer.render(scene, camera);
// // }

// // main();

// "use strict";

// const  renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas")});

// // There's no reason to set the aspect here because we're going
// // to set it every frame anyway so we'll set it to 2 since 2
// // is the the aspect for the canvas default size (300w/150h = 2)
// const  camera = new THREE.PerspectiveCamera(70, 2, 1, 1000);
// camera.position.z = 400;

// const scene = new THREE.Scene();
// const geometry = new THREE.BoxGeometry(200, 200, 200);
// const material = new THREE.MeshPhongMaterial({
//   color: 0x555555,
//   specular: 0xffffff,
//   shininess: 50,
//   shading: THREE.SmoothShading
// });

// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// const light1 = new THREE.PointLight(0xff80C0, 2, 0);
// light1.position.set(200, 100, 300);
// scene.add(light1);

// function resizeCanvasToDisplaySize() {
//   const canvas = renderer.domElement;
//   const width = canvas.clientWidth;
//   const height = canvas.clientHeight;
//   if (canvas.width !== width ||canvas.height !== height) {
//     // you must pass false here or three.js sadly fights the browser
//     renderer.setSize(width, height, false);
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();

//     // set render target sizes here
//   }
// }

// function animate(time) {
//   time *= 0.001;  // seconds

//   resizeCanvasToDisplaySize();

//   mesh.rotation.x = time * 0.5;
//   mesh.rotation.y = time * 1;

//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }

// requestAnimationFrame(animate);

// ---------------------------------------------------------

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

renderer.setClearColor( 0xffffff );

const cameraP = {fov: 90, aspect: 2, near: 0.1, far: 30};
const camera = new THREE.PerspectiveCamera(cameraP.fov, cameraP.aspect, cameraP.near, cameraP.far);

camera.position.z = 15;

const scene = new THREE.Scene();

// const controls = new OrbitControls( camera, renderer.domElement );
// controls.keys = {
// 	LEFT: 'ArrowLeft', //left arrow
// 	UP: 'ArrowUp', // up arrow
// 	RIGHT: 'ArrowRight', // right arrow
// 	BOTTOM: 'ArrowDown' // down arrow
// }

// Load designs
const loader = new GLTFLoader();
var tank;
loader.load(
    '../Resources/Blender/tank.glb',
    
    function ( gltf ) {
        const material = new THREE.MeshBasicMaterial({color: 0x03d3fc});

        let head = gltf.scene.children[0];
        let body = gltf.scene.children[2];
        let tires = gltf.scene.children[1];

        head.material = material; // Change color of the tank
        body.material = material; // Change color of the tank

        scene.add( head );
        scene.add( body );
        scene.add( tires );
        console.log("Tank loaded");

        requestAnimationFrame(animate);
    },
    function ( xhr ) { // called while loading is progressing
        console.log( 'Loading tank: ' + parseInt( xhr.loaded / xhr.total * 100 ) + '%' );
    },
    function ( error ) { // error
        console.error( error );
    } 
);


function animate(time) {
    time *= 0.001;  // seconds
  
    // tank.rotation.x = Math.cos(time * 0.5);
    // tank.rotation.y = Math.cos(time * 0.5);
    // let ampli = 15;
    // camera.position.x = ampli * Math.sin(time);
    // camera.rotation.y = ampli * Math.cos(time);
    // camera.position.z = ampli * Math.cos(time);

    // controls.update();

    
  
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
  
console.log(camera)

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