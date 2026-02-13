import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

/* ======================
   BASE
====================== */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/* ======================
   IMAGE PARTICLES
====================== */

let material = null;
let geometry = null;
let points = null;

const image = new Image();
image.src = "tu_imagen.png"; // ← CAMBIA ESTO

image.onload = () => {

    if(points){
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    // canvas oculto para leer pixeles
    const tempCanvas = document.createElement("canvas");
    const ctx = tempCanvas.getContext("2d");

    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    ctx.drawImage(image,0,0);

    const data = ctx.getImageData(0,0,image.width,image.height).data;

    const pixels = [];

    for(let y=0;y<image.height;y++){
        for(let x=0;x<image.width;x++){
            const i = (y*image.width+x)*4;
            const a = data[i+3];

            if(a > 50){
                pixels.push({
                    x,
                    y,
                    r:data[i],
                    g:data[i+1],
                    b:data[i+2]
                });
            }
        }
    }

    const positions = new Float32Array(pixels.length*3);
    const colors = new Float32Array(pixels.length*3);

    pixels.forEach((p,i)=>{
        const i3=i*3;

        positions[i3]   = (p.x-image.width/2)*0.01;
        positions[i3+1] = -(p.y-image.height/2)*0.01;
        positions[i3+2] = (Math.random()-0.5)*0.5;

        colors[i3]   = p.r/255;
        colors[i3+1] = p.g/255;
        colors[i3+2] = p.b/255;
    });

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors,3));

    material = new THREE.PointsMaterial({
        size:0.02,
        sizeAttenuation:true,
        vertexColors:true,
        blending:THREE.AdditiveBlending,
        depthWrite:false
    });

    points = new THREE.Points(geometry,material);
    scene.add(points);
};

/* ======================
   SIZES
====================== */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener("resize",()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width,sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
});

/* ======================
   CAMERA
====================== */

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(3,3,3);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/* ======================
   RENDERER
====================== */

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

/* ======================
   ANIMATION
====================== */

const clock = new THREE.Clock();

const tick = ()=>{

    const elapsedTime = clock.getElapsedTime();

    controls.update();

    camera.position.x = Math.cos(elapsedTime*0.05)*3;
    camera.position.z = Math.sin(elapsedTime*0.05)*3;
    camera.lookAt(0,0,0);

    renderer.render(scene,camera);
    requestAnimationFrame(tick);
};

tick();

