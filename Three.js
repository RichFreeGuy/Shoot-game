// Import Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.136/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.136/examples/jsm/controls/PointerLockControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Player Controls
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5).normalize();
scene.add(light);

// Ground
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Gun (Simple Box)
const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
const gunMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
const gun = new THREE.Mesh(gunGeometry, gunMaterial);
gun.position.set(0, -0.5, -1);
camera.add(gun);
scene.add(camera);

// Bullets
const bullets = [];
document.addEventListener('mousedown', () => {
    const bulletGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(camera.position);
    bullet.velocity = new THREE.Vector3(
        -Math.sin(camera.rotation.y),
        0,
        -Math.cos(camera.rotation.y)
    );
    bullets.push(bullet);
    scene.add(bullet);
});

// Animate
function animate() {
    requestAnimationFrame(animate);
    
    // Bullet Movement
    bullets.forEach((bullet, index) => {
        bullet.position.addScaledVector(bullet.velocity, 0.5);
        if (bullet.position.length() > 50) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}
animate();
