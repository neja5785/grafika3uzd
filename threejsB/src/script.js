import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xf0fff0);
const axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );

// Objects
//const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const boardgeo = new THREE.BoxGeometry(4,1,4)

// Materials
//const texture = new THREE.TextureLoader().load( 'https://ak.picdn.net/shutterstock/videos/1023138718/thumb/7.jpg' )
//const material = new THREE.MeshBasicMaterial( {map : texture } )
const materialW = new THREE.MeshBasicMaterial()
const materialB = new THREE.MeshBasicMaterial({color: 0x000000})
const figureMaterial = new THREE.MeshLambertMaterial( {color: "white"} );
//material.color = new THREE.Color(0xffffff)

// Mesh
//const board = new THREE.Mesh(boardgeo,material)
//const sphere = new THREE.Mesh(geometry,material)
//scene.add(board)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = -1
pointLight.position.y = 10
pointLight.position.z = -1
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 1)
pointLight2.position.x = 10
pointLight2.position.y = 10
pointLight2.position.z = 10
scene.add(pointLight2)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000)
camera.position.x = -20;
camera.position.y = 40;
camera.position.z = -20;
camera.lookAt(new THREE.Vector3(8, 0, 8));
scene.add(camera)
let camera2 = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 1, 100)
camera2.position.x = 5;
camera2.position.y = 5;
camera2.position.z = 5;
let camera3 = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 1, 200)
camera3.position.x = 16;
camera3.position.y = 30;
camera3.position.z = 16;
camera3.up.set(1,0,1)
camera3.lookAt(new THREE.Vector3(8, 0, 8));


//camera3.updateProjectionMatrix();


var camera2Helper = new THREE.CameraHelper( camera2 );

scene.add( camera2Helper );

var camera3Helper = new THREE.CameraHelper( camera3 );
scene.add( camera3Helper );
camera3Helper.update();
var activeCamera = camera;


 const controls = {
    camera1: () => Camera1(),
    camera2: () => Camera2(),
    camera3: () => Camera3(),
}
    gui.add(controls, 'camera1').name("Pirma kamera");
	gui.add(controls, 'camera2').name("Antra kamera");
	gui.add(controls, 'camera3').name("Trečia kamera");
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const tick = () =>
{
    // Render
    renderer.render(scene, activeCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


function boardCreation(){
    var bool = true;
    for( var i = 0; i<8; i++){
        for( var j = 0; j<8 ;j++){
            if(bool){
                var square = new THREE.Mesh(boardgeo,materialW);
                square.position.set(i*4,0,j*4)
                scene.add(square)
                bool = !bool
            }
            else {
                var square = new THREE.Mesh(boardgeo,materialB);
                square.position.set(i*4,0,j*4)
                scene.add(square)
                bool = !bool}
        }
        bool = !bool
    }
}
boardCreation()
function createKing(){
    

	const padGeometry = new THREE.CylinderGeometry( 2, 2, 1 );
    const pad = new THREE.Mesh( padGeometry, figureMaterial );

	const bodyGeometry = new THREE.ConeGeometry( 2, 3 );
    const body = new THREE.Mesh( bodyGeometry, figureMaterial );
	body.position.set(0, 2, 0);

	const neckGeometry = new THREE.CylinderGeometry( 0.8, 1.4, 5, 20 );
    const neck = new THREE.Mesh( neckGeometry, figureMaterial );
	neck.position.set(0, 3, 0);

	const capGeometry = new THREE.CylinderGeometry( 1.5, 1.5, 0.3, 8 );
    const cap = new THREE.Mesh( capGeometry, figureMaterial );
	cap.position.set(0, 5.5, 0);

    const topGeometry = new THREE.CylinderGeometry( 1, 0.7, 1, 20 );
    const top = new THREE.Mesh( topGeometry, figureMaterial );
    top.position.set(0,6,0)

    const crossGeometry1 = new THREE.CylinderGeometry( 0.3, 0.3, 1, 20 );
    const cross1 = new THREE.Mesh(crossGeometry1, figureMaterial );
    // cross1.rotation.x = Math.Pi
    cross1.position.set(0,7,0)

    const crossGeometry2 = new THREE.CylinderGeometry( 0.3, 0.3, 1, 20 );
    const cross2 = new THREE.Mesh(crossGeometry2, figureMaterial );
    cross2.rotation.x = Math.PI/2
    cross2.position.set(0,7,0)

	var king = new THREE.Object3D();


    king.add(pad);
    king.add(body);
    king.add(neck);
    king.add(cap);
    king.add(top);
    king.add(cross1);
    king.add(cross2);
	king.position.set(0, 1, 0);

	return king;
}
const King = createKing();
scene.add(King);
//camera2.lookAt(King.position)
//camera2Helper.update();
function Camera1(){
    activeCamera = camera;
    camera2Helper.visible = true;
    camera3Helper.visible = true;

}
async function Camera2(){
    camera2Helper.visible = false;
    camera3Helper.visible = false;
    camera2.position.set(-30,5.5,-30);
    camera2.lookAt(1,5,1);
    camera2.updateProjectionMatrix();
    activeCamera = camera2;

    for(var fov = 40; fov < 100; fov++) {
    // await sleep(50);
	camera2.fov = fov;
	camera2.updateProjectionMatrix();
	var distance = 20 / (2 * Math.tan(0.5 * fov * Math.PI / 180));
	camera2.position.set(-distance, 5, -distance);
	}
    for(var fov = 100; fov > 40; fov--) {
    await sleep(50);
	camera2.fov = fov;
	camera2.updateProjectionMatrix();
	var distance = 20 / (2 * Math.tan(0.5 * fov* Math.PI / 180));
	camera2.position.set(-distance, 5, -distance);
	}
	
    
}
async function Camera3(){
    activeCamera = camera3;
    camera2Helper.visible = false;
    camera3Helper.visible = false;
    for(var i = 0; i<60; i++){
        await sleep(50)
        King.position.set(i/2,1,i/2)
        camera3.lookAt(King.position);
        //camera3.up.set(0,1,0)
        //console.log(King.position.length())
        camera3.updateProjectionMatrix();
        camera3Helper.update();
    }
    
    King.position.set(0,1,0)
    camera3.lookAt(King.position);
    camera3.updateProjectionMatrix();
    camera3Helper.update();
    Camera1()
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }
//renderer.render(scene, camera)
tick()