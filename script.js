// import './style.css'
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js";

import { FontLoader } from "https://threejs.org/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://threejs.org/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";;


// import { Geometry, TetrahedronGeometry } from 'three'

/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//galaxy
const parameters = {}
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 2.15; 
parameters.branches = 3; 
parameters.spin = 3;
parameters.randomness = 5;
parameters.randomnessPower = 4;
parameters.insideColor = '#ff6030';
parameters.outsideColor = '#0949f0';

let material = null; 
let geometry = null; 
let points = null; 

const generateGalaxy = () => {
    
if(points !== null){
    geometry.dispose();
    material.dispose();
    scene.remove(points);
}
material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);

    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);


    for(let i=0; i<parameters.count; i++){
        const i3 = i*3;
        const radius = Math.pow(Math.random()*parameters.randomness, Math.random()*parameters.radius);
        const spinAngle = radius*parameters.spin;
        const branchAngle = ((i%parameters.branches)/parameters.branches)*Math.PI*2;
        

        const negPos = [1,-1];
        const randomX = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];
        const randomY = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower)*negPos[Math.floor(Math.random() * negPos.length)];

        positions[i3] = Math.cos(branchAngle + spinAngle)*(radius) + randomX;
        positions[i3+1] = randomY;
        positions[i3+2] = Math.sin(branchAngle + spinAngle)*(radius) + randomZ;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, Math.random()*radius/parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3+1] = mixedColor.g;
        colors[i3+2] = mixedColor.b;
        
        
    }
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));

    points = new THREE.Points(geometry, material);
    scene.add(points);

}
generateGalaxy();

const textureLoader = new THREE.TextureLoader();
const centerTexture = textureLoader.load("Dandadan.png");

const centerGeo = new THREE.CircleGeometry(0.7, 64);
const centerMat = new THREE.MeshBasicMaterial({
    map: centerTexture,
    transparent: true
});

const centerImage = new THREE.Mesh(centerGeo, centerMat);
scene.add(centerImage);

// FRASES
const frases = [
"Te amo","Eres mi reina","Mi corazón es tuyo","No puedo vivir sin ti","Eres mi razón de ser",
"Mi vida eres tú","Te necesito siempre","Eres mi todo","Mi alma te pertenece","Eres mi inspiración",
"Te pienso día y noche","Eres mi sueño hecho realidad","Mi felicidad eres tú","Te extraño cada segundo",
"Eres mi luz en la oscuridad","Mi mundo gira por ti","Te adoro con el alma","Eres mi paz",
"Mi sonrisa nace de ti","Te llevo en mi corazón","Eres mi destino","Mi vida sin ti no existe",
"Te quiero más que ayer","Eres mi tesoro","Mi amor por ti es infinito","Eres mi ángel",
"Te pienso en cada latido","Eres mi alegría","Mi corazón late por ti","Te amo sin medida",
"Eres mi compañera perfecta","Mi alma se calma contigo","Te necesito como el aire",
"Eres mi refugio","Mi amor nunca se acaba","Te quiero con locura","Eres mi razón de sonreír",
"Mi vida eres tú sola","Te amo más que a nada","Eres mi ilusión","Mi corazón es tuyo siempre",
"Te pienso en silencio","Eres mi fuerza","Mi amor es eterno","Te extraño con el alma",
"Eres mi estrella","Mi vida se ilumina contigo","Te adoro cada día","Eres mi razón de luchar",
"Mi corazón suspira por ti","Te amo con pasión","Eres mi melodía","Mi alma canta por ti",
"Te quiero sin fin","Eres mi regalo de Dios","Mi vida se completa contigo","Te pienso en mis sueños",
"Eres mi esperanza","Mi amor crece contigo","Te extraño en cada instante","Eres mi alegría infinita",
"Mi corazón sonríe contigo","Te amo con ternura","Eres mi razón de vivir","Mi alma se entrega a ti",
"Te quiero con devoción","Eres mi milagro","Mi vida eres tú entera","Te pienso en cada amanecer",
"Eres mi destino eterno","Mi amor nunca muere","Te extraño cada día","Eres mi razón de existir",
"Mi corazón se enciende contigo","Te amo con sinceridad","Eres mi refugio seguro",
"Mi alma descansa contigo","Te quiero con dulzura","Eres mi razón de soñar","Mi vida se llena contigo",
"Te pienso en cada suspiro","Eres mi alegría pura","Mi corazón vibra contigo","Te amo con entrega",
"Eres mi razón de amar","Mi alma se une a ti","Te quiero con ternura","Eres mi razón de esperanza",
"Mi vida eres tú siempre","Te pienso en cada mirada","Eres mi razón de fe","Mi amor es tuyo",
"Te extraño con pasión","Eres mi razón de calma","Mi corazón se rinde a ti",
"Te amo con todo mi ser","Eres mi razón de alegría","Mi alma suspira por ti",
"Te quiero con todo el corazón","Eres mi razón de amor"
];

const textGroup = new THREE.Group();
scene.add(textGroup);

const fontLoader = new FontLoader();

fontLoader.load(
"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
(font)=>{

frases.forEach((texto,i)=>{

const geo = new TextGeometry(texto,{
    font:font,
    size:0.12,
    height:0.01
});

const mat = new THREE.MeshBasicMaterial({
    color:0xffffff,
    transparent:true,
    opacity:0.9
});

const mesh = new THREE.Mesh(geo,mat);

const angle = (i/frases.length)*Math.PI*2;
const radius = 2.5;

mesh.position.x = Math.cos(angle)*radius;
mesh.position.z = Math.sin(angle)*radius;
mesh.position.y = (Math.random()-0.5)*1.5;

mesh.lookAt(0,0,0);

textGroup.add(mesh);

});
});



/**
 * Test cube
 */

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
const camera = new 
THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    camera.position.x = Math.cos(elapsedTime*0.05)*4;
    camera.position.z = Math.sin(elapsedTime*0.05)*4;
    camera.lookAt(0,0,0);

    textGroup.rotation.y += 0.002;

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick();



