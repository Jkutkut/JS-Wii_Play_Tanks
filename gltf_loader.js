import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load(
    '../../Resources/Blender/tank.glb',
    
    function ( gltf ) {

        tank.head = gltf.scene.children[0];
        tank.gunTip = gltf.scene.children[1];
        tank.body = gltf.scene.children[2];
        tank.tires = gltf.scene.children[3];

        // head.material.color.r = 1; // Change color of the tank
        // head.material.color.b = 1; // Change color of the tank
        // head.material.color.g = 1; // Change color of the tank

        // scene.add( head );
        // scene.add( gunTip );
        // scene.add( body );
        // scene.add( tires );



        console.log("Tank loaded");

        // requestAnimationFrame(animate);
    },
    function ( xhr ) { // called while loading is progressing
        console.log( 'Loading tank: ' + parseInt( xhr.loaded / xhr.total * 100 ) + '%' );
    },
    function ( error ) { // error
        console.error( error );
    } 
);