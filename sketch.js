import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


var scene, renderer, camera;
var stats;

init();
animate();

function init() {
    const canvas = document.querySelector('#canvas');
    renderer = new THREE.WebGLRenderer( {canvas, antialias:true} );

    document.body.appendChild (renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera (45, 1, 1, 10000);
    
    camera.position.x = 0;
    camera.position.y = 300;
    camera.position.z = 125;

    camera.lookAt (new THREE.Vector3(0,0,0));
    
    // Add elements

    // light

    const light1 = new THREE.PointLight( 0xffffff, 1.2, 100, 1 );
    const light2 = new THREE.PointLight( 0xffffff, 1.2, 100, 1 );
    light1.position.set(  20,  20,  20 );
    light2.position.set( -20,  20, -20 );
    scene.add( light1 );
    scene.add( light2 );

    // grid
    var gridXZ = new THREE.GridHelper(250, 20);
    scene.add(gridXZ);

    // load tank
    const loader = new GLTFLoader();
    loader.load(
        '../../Resources/Blender/tank.glb',
        
        function ( gltf ) {
    
            let head = gltf.scene.children[0];
            let gunTip = gltf.scene.children[1];
            let body = gltf.scene.children[2];
            let tires = gltf.scene.children[3];
    
            head.material.color.r = 1; // Change color of the tank
            head.material.color.b = 1; // Change color of the tank
            head.material.color.g = 1; // Change color of the tank

            scene.add( head );
            scene.add( gunTip );
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


    // FPS counter
    stats = new Stats();
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    // Change canvas size based on window
    $(window).resize(resizeTextSize); // When screen size change, adjust text size
    resizeTextSize();
}

function animate() {
    stats.begin();

    requestAnimationFrame ( animate );
    
    stats.end();

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