import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controlsOrbit;
let sphere, controls = {};
let cubes = [];
let score = 0;
const sphereRadius = 10;
const cubeSize = 20;

init();
animate();

function init() {
  // Scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 50, 100);

  // Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Orbit controls
  controlsOrbit = new OrbitControls(camera, renderer.domElement);
  controlsOrbit.enableDamping = true;

  // Sphere
  const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Key input
  window.addEventListener('keydown', e => controls[e.key.toLowerCase()] = true);
  window.addEventListener('keyup', e => controls[e.key.toLowerCase()] = false);

  // Spawn cubes every 10 seconds
  setInterval(spawnCube, 10000);
}

function spawnCube() {
  const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);

  // Random direction from sphere
  const direction = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize();

  // Spawn 40 units away
  const spawnDistance = 40;
  cube.position.copy(sphere.position).add(direction.multiplyScalar(spawnDistance));

  scene.add(cube);
  cubes.push(cube);
}

function animate() {
  requestAnimationFrame(animate);

  // Movement
  const speed = 1.5;
  if (controls['w']) sphere.position.z -= speed;
  if (controls['s']) sphere.position.z += speed;
  if (controls['a']) sphere.position.x -= speed;
  if (controls['d']) sphere.position.x += speed;
  if (controls['e']) sphere.position.y += speed;
  if (controls['q']) sphere.position.y -= speed;

  // Collision detection
  cubes = cubes.filter(cube => {
    const dist = sphere.position.distanceTo(cube.position);
    if (dist < sphereRadius + cubeSize / 2) {
      scene.remove(cube);
      score++;
      document.getElementById('score').innerText = `Score: ${score}`;
      return false;
    }
    return true;
  });

  controlsOrbit.update();
  renderer.render(scene, camera);
}
