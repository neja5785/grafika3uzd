import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
import * as dat from 'dat.gui'

const clock = new THREE.Clock()

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xffffff);

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
//console.log(geometry.getAttribute("position").array)

// Materials
const texture = new THREE.TextureLoader().load( 'https://ak.picdn.net/shutterstock/videos/1023138718/thumb/7.jpg' )
texture.wrapS = THREE.RepeatWrapping
texture.minFilter = THREE.LinearFilter
var spGroup
var hullMesh

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// Image

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000)
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 50;
camera.lookAt(new THREE.Vector3(10, 0, 0));
scene.add(camera)

// Controls
 const controls = new OrbitControls(camera, canvas)
 controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


function createMesh(geom) {
    var meshMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5});
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial({color: 'black'});
    wireFrameMat.wireframe = true;
    var material = new THREE.MeshBasicMaterial( {map : texture , transparent: false, opacity: 0.5} )
    var mesh = SceneUtils.createMultiMaterialObject(geom, [material, wireFrameMat]);
    return mesh;
}
function generatePoints() {
    var pts = [];
    for (var i = 0; i < 2000; i++) {
        var x = -10 + Math.round(Math.random() * 20);
        var y = -10 + Math.round(Math.random() * 20);
        var z = -10 + Math.round(Math.random() * 20);
        if((Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2)) <= 100){
            pts.push(new THREE.Vector3(x, y, z));
        }
    
    }
    spGroup = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: false});
    pts.forEach(function (point) {
        var spGeom = new THREE.SphereGeometry(0.1);
        var spMesh = new THREE.Mesh(spGeom, material);
        spMesh.position.x = point.x;
        spMesh.position.y = point.y;
        spMesh.position.z = point.z;
        spGroup.add(spMesh);
    });   
    scene.add(spGroup);
    var hullGeometry = new ConvexGeometry(pts);
    var arr = hullGeometry.getAttribute("position").array
    console.log(arr)
    var uvs = []
    for( var i = 0; i<arr.length; i += 3){
        
        var u = Math.atan2(arr[i],arr[i+2]) / (2*Math.PI) + 0.5;
        var v = 0.5 - (Math.asin((arr[i+1])/20)/Math.PI) ;
        uvs.push(...[u,v])
    }
    hullGeometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(uvs), 2));
    
    for(var i = 0; i<hullGeometry.attributes.uv.count; i+=6){

        if(Math.abs(hullGeometry.attributes.uv.array[i] - hullGeometry.attributes.uv.array[i+2]) > 0.5 
    &&  0.5 > Math.abs(hullGeometry.attributes.uv.array[i] - hullGeometry.attributes.uv.array[i+4])){
        if(hullGeometry.attributes.uv.array[i] > hullGeometry.attributes.uv.array[i+2]){
            hullGeometry.attributes.uv.array[i+2]++;
        }
        else hullGeometry.attributes.uv.array[i+2]--;
    }
    else if(Math.abs(hullGeometry.attributes.uv.array[i] - hullGeometry.attributes.uv.array[i+4]) > 0.5 
    &&  0.5 > Math.abs(hullGeometry.attributes.uv.array[i] - hullGeometry.attributes.uv.array[i+2])){
        if(hullGeometry.attributes.uv.array[i] > hullGeometry.attributes.uv.array[i+4]){
            hullGeometry.attributes.uv.array[i+4]++;
        }
        else hullGeometry.attributes.uv.array[i+4]--;
    }
    else if(Math.abs(hullGeometry.attributes.uv.array[i] - hullGeometry.attributes.uv.array[i+2]) > 0.5 
    &&  0.5 > Math.abs(hullGeometry.attributes.uv.array[i+4] - hullGeometry.attributes.uv.array[i+2])){
        if(hullGeometry.attributes.uv.array[i] < hullGeometry.attributes.uv.array[i+2]){
            hullGeometry.attributes.uv.array[i]++;
        }
        else hullGeometry.attributes.uv.array[i]--;
    }
    else if(Math.abs(hullGeometry.attributes.uv.array[i+4] - hullGeometry.attributes.uv.array[i+2]) > 0.5 
    &&  0.5 > Math.abs(hullGeometry.attributes.uv.array[i] - hullGeometry.attributes.uv.array[i+4])){
        if(hullGeometry.attributes.uv.array[i+4] > hullGeometry.attributes.uv.array[i+2]){
            hullGeometry.attributes.uv.array[i+2]++;
        }
        else hullGeometry.attributes.uv.array[i+2]--;
    }
    else if(Math.abs(hullGeometry.attributes.uv.array[i+2] - hullGeometry.attributes.uv.array[i+4]) > 0.5 
    &&  0.5 > Math.abs(hullGeometry.attributes.uv.array[i] - hullGeometry.attributes.uv.array[i+2])){
        if(hullGeometry.attributes.uv.array[i+2] > hullGeometry.attributes.uv.array[i+4]){
            hullGeometry.attributes.uv.array[i+4]++;
        }
        else hullGeometry.attributes.uv.array[i+4]--;
    }
    else if(Math.abs(hullGeometry.attributes.uv.array[i] - hullGeometry.attributes.uv.array[i+4]) > 0.5 
    &&  0.5 > Math.abs(hullGeometry.attributes.uv.array[i+4] - hullGeometry.attributes.uv.array[i+2])){
        if(hullGeometry.attributes.uv.array[i+4] > hullGeometry.attributes.uv.array[i]){
            hullGeometry.attributes.uv.array[i]++;
        }
        else hullGeometry.attributes.uv.array[i]--;
    }
    }
    
    hullMesh = createMesh(hullGeometry);
    scene.add(hullMesh);
}

generatePoints()
const axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );
/**
 * Animate
 */



const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
