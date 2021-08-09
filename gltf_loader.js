import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load(
    '../../Resources/Blender/tank.glb',
    
    function ( gltf ) { // Loaded correctly
        // Store them on the Tank class

        Tank.MESH.head = gltf.scene.children[0];
        let gunTip = gltf.scene.children[1];

        Tank.MESH.body = gltf.scene.children[2];
        let tires = gltf.scene.children[3];

        // Store the gunTip and the tires as children of the head and the body
        Tank.MESH.head.children.push(gunTip);
        Tank.MESH.body.children.push(tires);

        console.log("Tank loaded");
    },
    function ( xhr ) { // called while loading is progressing
        console.log( 'Loading tank: ' + parseInt( xhr.loaded / xhr.total * 100 ) + '%' );
    },
    function ( error ) { // error
        console.error( error );
    } 
);