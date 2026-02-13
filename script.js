import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js";


const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

/* ---------------- GALAXIA ---------------- */

const parameters = {
    count: 60000,
    size: 0.02,
    radius: 2,
    branches: 4,
    spin: 2,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: "#ff6b81",
    outsideColor: "#5f27cd"
};

let geometry = new THREE.BufferGeometry();
let material = new THREE.PointsMaterial({
    size: parameters.size,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const positions = new Float32Array(parameters.count * 3);
const colors = new Float32Array(parameters.count * 3);

const colorInside = new THREE.Color(parameters.insideColor);
const colorOutside = new THREE.Color(parameters.outsideColor);

for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

    const randomX = (Math.random() - 0.5) * parameters.randomness;
    const randomY = (Math.random() - 0.5) * parameters.randomness;
    const randomZ = (Math.random() - 0.5) * parameters.randomness;

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

/* ---------------- FOTO CENTRO ---------------- */

const textureLoader = new THREE.TextureLoader();
const centerTexture = textureLoader.load("Dandadan.png");

const centerGeo = new THREE.CircleGeometry(0.7, 64);
const centerMat = new THREE.MeshBasicMaterial({
    map: centerTexture,
    transparent: true
});

const centerImage = new THREE.Mesh(centerGeo, centerMat);
scene.add(centerImage);

/* ---------------- FRASES ---------------- */

const frases = [
"Te amo","Eres mi reina","Mi corazón es tuyo","Eres mi todo",
"Mi vida eres tú","Te extraño","Eres mi razón","Mi felicidad",
"Eres mi luz","Mi corazón late por ti","Te adoro","Eres mi destino",
"Mi amor infinito","Eres mi inspiración","Te pienso siempre",
"Eres mi ángel","Mi alma te pertenece","Eres mi estrella"
];

const textGroup = new THREE.Group();
scene.add(textGroup);

function crearTexto(texto){
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 128;

    ctx.fillStyle = "white";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(texto, canvas.width/2, 80);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent:true
    });

    return new THREE.Sprite(material);
}

frases.forEach((texto,i)=>{
    const sprite = crearTexto(texto);

    const angle = (i/frases.length)*Math.PI*2;
    const radius = 2.5;

    sprite.position.set(
        Math.cos(angle)*radius,
        (Math.random()-0.5)*1.5,
        Math.sin(angle)*radius
    );

    sprite.scale.set(1.5,0.4,1);

    textGroup.add(sprite);
});

/* ---------------- CAMERA ---------------- */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(3,3,3);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/* ---------------- RENDERER ---------------- */

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

window.addEventListener("resize",()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width,sizes.height);
});

/* ---------------- ANIMATE ---------------- */

const clock = new THREE.Clock();

function animate(){
    const t = clock.getElapsedTime();

    controls.update();

    camera.position.x = Math.cos(t*0.2)*4;
    camera.position.z = Math.sin(t*0.2)*4;
    camera.lookAt(0,0,0);

    textGroup.rotation.y += 0.002;

    renderer.render(scene,camera);
    requestAnimationFrame(animate);
}
animate();



