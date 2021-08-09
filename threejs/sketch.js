import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


var scene, renderer, camera;
var controls;

init();
animate();

function init() {
    const canvas = document.querySelector('#canvas');
    renderer = new THREE.WebGLRenderer( {canvas, antialias:true} );

    document.body.appendChild (renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera (45, 1, 1, 10000);
    camera.position.y = 16;
    camera.position.z = 40;
    camera.lookAt (new THREE.Vector3(0,0,0));

    controls = new OrbitControls (camera, renderer.domElement);
    
    var gridXZ = new THREE.GridHelper(100, 20);
    scene.add(gridXZ);

    // load tank
    const loader = new GLTFLoader();
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

    // Change canvas size based on window
    $(window).resize(resizeTextSize); // When screen size change, adjust text size
    resizeTextSize();
}

function animate() {
    controls.update();
    requestAnimationFrame ( animate );  
    renderer.render (scene, camera);
}




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