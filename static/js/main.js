import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(145, 96, -180);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth interaction
controls.dampingFactor = 0.05;
controls.update();

// Cube geometry
const geometry = new THREE.BoxGeometry(10, 10, 10);

// Materials
const normalMaterial = new THREE.MeshNormalMaterial();
const heroMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Static cubes
const cubes = [];
let cubeCollided = new Array(5).fill(false);

for (let i = 0; i < 5; i++) {
    const cube = new THREE.Mesh(geometry, normalMaterial);
    cube.position.x = (i - 2) * 15;
    cube.position.z = 0;
    scene.add(cube);
    cubes.push(cube);
}

// Hero cube
const heroCube = new THREE.Mesh(geometry, heroMaterial);
heroCube.position.set(0, 0, 50);
scene.add(heroCube);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(ambientLight, directionalLight);

// Movement controls
const keys = { w: false, a: false, s: false, d: false };

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
});

document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
});

// Collision logic
let collisionCount = 0;
const countDisplay = document.getElementById('collisionCount');

function updateCollisionCount() {
    countDisplay.textContent = collisionCount;
}

// Reset function exposed globally for button click
window.resetCollisions = function () {
    collisionCount = 0;
    updateCollisionCount();
    cubeCollided = new Array(cubes.length).fill(false);
    heroCube.position.set(0, 0, 50);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Hero cube movement
    const speed = 0.5;
    if (keys.w) heroCube.position.z -= speed;
    if (keys.s) heroCube.position.z += speed;
    if (keys.a) heroCube.position.x -= speed;
    if (keys.d) heroCube.position.x += speed;

    // Bounding box for hero
    const heroBox = new THREE.Box3().setFromObject(heroCube);

    // Check collisions
    cubes.forEach((cube, index) => {
        const cubeBox = new THREE.Box3().setFromObject(cube);
        if (!cubeCollided[index] && heroBox.intersectsBox(cubeBox)) {
            cubeCollided[index] = true;
            collisionCount++;
            updateCollisionCount();
        }
    });

    // Rotate cubes
    cubes.forEach((cube, i) => {
        cube.rotation.x += 0.01 + i * 0.001;
        cube.rotation.y += 0.01 + i * 0.001;
    });

    controls.update();

    renderer.render(scene, camera);
}

animate();
