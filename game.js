import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Physics World
const world = new CANNON.World();
world.gravity.set(0, -9.8, 0); // Gravity

// Ground
const groundMaterial = new CANNON.Material();
const groundBody = new CANNON.Body({
    mass: 0, // Static ground
    shape: new CANNON.Plane(),
    material: groundMaterial
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterialThree = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterialThree);
groundMesh.rotation.x = -Math.PI / 2;
scene.add(groundMesh);

// Player
const playerShape = new CANNON.Sphere(1);
const playerBody = new CANNON.Body({
    mass: 5,
    shape: playerShape,
    position: new CANNON.Vec3(0, 5, 0)
});
world.addBody(playerBody);

// Bullets
const bullets = [];
function shootBullet() {
    const bulletGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
    scene.add(bulletMesh);

    const bulletShape = new CANNON.Sphere(0.2);
    const bulletBody = new CANNON.Body({
        mass: 1,
        shape: bulletShape,
        position: new CANNON.Vec3(playerBody.position.x, playerBody.position.y, playerBody.position.z)
    });

    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    bulletBody.velocity.set(forwardVector.x * 20, forwardVector.y * 20, forwardVector.z * 20);
    world.addBody(bulletBody);

    bullets.push({ mesh: bulletMesh, body: bulletBody });
}

// Input Handling
const keys = {};
window.addEventListener('keydown', (event) => { keys[event.code] = true; });
window.addEventListener('keyup', (event) => { keys[event.code] = false; });
window.addEventListener('click', shootBullet);

// Game Loop
function animate() {
    requestAnimationFrame(animate);
    world.step(1 / 60);

    // Player Movement
    if (keys["KeyW"]) playerBody.position.z -= 0.1;
    if (keys["KeyS"]) playerBody.position.z += 0.1;
    if (keys["KeyA"]) playerBody.position.x -= 0.1;
    if (keys["KeyD"]) playerBody.position.x += 0.1;

    camera.position.set(playerBody.position.x, playerBody.position.y + 2, playerBody.position.z);

    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.mesh.position.copy(bullet.body.position);
        if (bullet.body.position.y < -10) {
            world.removeBody(bullet.body);
            scene.remove(bullet.mesh);
            bullets.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

animate();
