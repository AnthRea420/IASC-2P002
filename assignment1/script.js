import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/**********
** SCENE **
***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(9.9, 3.5, 10.5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** MESHES **
************/
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})

// caveWall
const caveWallGeometry = new THREE.PlaneGeometry(10, 5)
const caveWall = new THREE.Mesh(caveWallGeometry, caveMaterial)
caveWall.rotation.y = Math.PI * 0.5
caveWall.position.set(-5, 0, 0)
caveWall.receiveShadow = true
scene.add(caveWall)

// barrierWall
const barrierWallGeometry = new THREE.PlaneGeometry(10, 2)
const barrierWall = new THREE.Mesh(barrierWallGeometry, caveMaterial)
barrierWall.rotation.y = Math.PI * 0.5
barrierWall.position.set(5, -1.5, 0)
scene.add(barrierWall)

// caveFloor
const caveFloorGeometry = new THREE.PlaneGeometry(10, 10)
const caveFloor = new THREE.Mesh(caveFloorGeometry, caveMaterial)
caveFloor.rotation.x = Math.PI * 0.5
caveFloor.position.set(0, -2.5, 0)
scene.add(caveFloor)

// OBJECTS
const group = new THREE.Group();
// First Ear
function createTetrahedron(position, rotation) {
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    const material = new THREE.MeshNormalMaterial();
    const Tetrahedron = new THREE.Mesh(geometry, material);
    Tetrahedron.position.copy(position);
    Tetrahedron.rotation.set(rotation.x, rotation.y, rotation.z);
    Tetrahedron.castShadow = true;
   // scene.add(Tetrahedron);
    return Tetrahedron;
}

function createSphere(position, radius) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    sphere.castShadow = true;
    //scene.add(sphere);
    return sphere;
}

// Create a Sphere
const sphere = createSphere(new THREE.Vector3(8, 1.8, -.5), 1.75);

// First Tetrahedron
const Tetrahedron = createTetrahedron(new THREE.Vector3(8.6, 3.01, -1.5), new THREE.Euler(2.2, Math.PI / 4.5, 2));
// Duplicate the First Tetrahedron
const Tetrahedron2 = createTetrahedron(new THREE.Vector3(7.6, 2.9, .4), new THREE.Euler(-1.8, Math.PI / -4.5, -2));

group.add(Tetrahedron);
group.add(Tetrahedron2);
group.add(sphere);

scene.add(group);



//torus
const torusGeometry = new THREE.TorusGeometry( 1.5, 0.5, 3, 200 ); 
const torusMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
const torus = new THREE.Mesh( torusGeometry, torusMaterial ); 
torus.position.set(6, 1.5, 0)
torus.castShadow = true
scene.add( torus );
torus.rotation.z = 9.23399999999996;
torus.rotation.y = 9.23399999999996;


// SUN
const sunGeometry = new THREE.SphereGeometry()
const sunMaterial = new THREE.MeshLambertMaterial({
    emissive: new THREE.Color('blue'),
    emissiveIntensity: 20
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)

/***********
** LIGHTS **
************/

// Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('blue'),
    0.5
)
directionalLight.target = caveWall
directionalLight.position.set(10, 2.5, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
scene.add(directionalLight)


/*********************
** DOM INTERACTIONS **
**********************/
// domObject
const domObject = {
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false
}

// continue-reading
document.querySelector('#continue-reading').onclick = function() {
    document.querySelector('#part-two').classList.remove('hidden')
    document.querySelector('#part-one').classList.add('hidden')
    domObject.part = 2
}

// restart
document.querySelector('#restart').onclick = function() {
    document.querySelector('#part-two').classList.add('hidden')
    document.querySelector('#part-one').classList.remove('hidden')
    domObject.part = 1

    // reset domObject changes
    domObject.firstChange = false
    domObject.secondChange = false
    domObject.thirdChange = false
    domObject.fourthChange = false

    // reset directionalLight
    directionalLight.position.set(10, 2.5, 0)
}

// first change
document.querySelector('#first-change').onclick = function() {
    domObject.firstChange = true
}

// second change
document.querySelector('#second-change').onclick = function() {
    domObject.secondChange = true
}

// third change
document.querySelector('#third-change').onclick = function() {
    domObject.thirdChange = true
}

// fourth change
document.querySelector('#fourth-change').onclick = function() {
    domObject.fourthChange = true
}

/*******************
** ANIMATION LOOP **
********************/
const radius = 5; // Adjust the radius of the circle
const speed = 0.01; // Adjust the speed of rotation
const clock = new THREE.Clock()

// Animate
const animation = () =>
{

    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime()

    const time = performance.now() * .05;



    // Update sun position to match directionalLight position
    sun.position.copy(directionalLight.position)

    // Controls
    controls.update()

    // DOM INTERACTIONS
    // part 1
    if(domObject.part === 1){
        camera.position.set(1.1, 0.3, 1.3)
        camera.lookAt(-5, 0, 1.5)
    }

    // part 2
    if(domObject.part === 2){
        camera.position.set(9.9, 3.5, 10.5)
        camera.lookAt(0, 0, 0)
    }

    // first-change
    if(domObject.firstChange){
        group.rotation.y = time * speed; 
    }
    // second-change
    if (domObject.secondChange) {
        group.rotation.y = 0;
        group.position.y = 0;
        group.position.x = 0;
        
        
        group.position.x = Math.sin(elapsedTime * 1) * -3;
        group.position.y = Math.cos(elapsedTime * 1) * Math.PI;
        group.position.z = Math.cos(elapsedTime * 1.7) * 4; 

    }

    // third-change
    if(domObject.thirdChange){
        group.position.y = 0;
        group.position.x = 0;
        group.position.z = 0;

        group.position.y = 4.7;
    }

    

    // Renderer
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()