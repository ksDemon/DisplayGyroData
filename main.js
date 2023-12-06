import * as THREE from 'three';

const width = window.innerHeight
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / width, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
THREE.PCFSoftShadowMap; // default 
const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 0, 0, 1 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 200; // default
light.shadow.mapSize.height = 200; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default


renderer.setSize( width, width );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0xff0000 } );

const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true; //default is false
cube.receiveShadow = true; //default
scene.add( cube );

const helper = new THREE.CameraHelper( light.shadow.camera );
scene.add( helper );

camera.position.z = 5;
var data = [0,0,0,0,0,0]


function animate() {

    requestAnimationFrame( animate );
    
	cube.rotation.x = Math.PI * (data[0]) / 180;
    cube.rotation.z = - Math.PI * (data[1]) / 180;

    //cube.rotation.y = Math.PI * (data[2]) / 180;

    cube.position.z = data[5]*.4
    cube.position.y = data[3]*.4
    cube.position.x = - data[5]*.4
    
    getData();

	renderer.render( scene, camera );

}

async function getData() {
    const response = await fetch("http://192.168.0.6/bmi160");
    if (!response.ok){
        throw new Error("HTTP error! status: ${response.status}");
    }
    data = await response.text();
    data = data.split(" ")
    data[0] = parseInt(data[0]) * 180 / 32768
    data[1] = parseInt(data[1]) * 180 / 32768
    data[2] = parseInt(data[2]) * 180 / 32768
    data[3] = parseInt(data[3]) * 4/32768
    data[4] = parseInt(data[4]) * 4/32768
    data[5] = parseInt(data[5]) * 4/32768
    document.getElementById("data").innerHTML = String(data[0]).slice(0,5) + " / " + String(data[1]).slice(0,5) + " / " + String(data[2]).slice(0,5)
    document.getElementById("data2").innerHTML = String(data[3]).slice(0,5) + " / " + String(data[4]).slice(0,5) + " / " + String(data[5]).slice(0,5)

}

animate();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
