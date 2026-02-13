import * as THREE from "https://unpkg.com/three@0.132.2/build/three.module.js";

import { OrbitControls } from "https://unpkg.com/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "https://unpkg.com/three@0.132.2/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "https://unpkg.com/three@0.132.2/examples/jsm/geometries/TextGeometry.js";

/**
 * Base
 */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/**
 * GALAXIA
 */
const parameters = {
    count:100000,
    size:0.01,
    radius:2.15,
    branches:3,
    spin:3,
    randomness:5,
    randomnessPower:4,
    insideColor:'#ff6030',
    outsideColor:'#0949f0'
}

let material=null
let geometry=null
let points=null

const generateGalaxy=()=>{
if(points!==null){
    geometry.dispose()
    material.dispose()
    scene.remove(points)
}

material=new THREE.PointsMaterial({
    size:parameters.size,
    sizeAttenuation:true,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexColors:true
})

geometry=new THREE.BufferGeometry()
const positions=new Float32Array(parameters.count*3)
const colors=new Float32Array(parameters.count*3)

const colorInside=new THREE.Color(parameters.insideColor)
const colorOutside=new THREE.Color(parameters.outsideColor)

for(let i=0;i<parameters.count;i++){
const i3=i*3

const radius=Math.random()*parameters.radius
const spinAngle=radius*parameters.spin
const branchAngle=((i%parameters.branches)/parameters.branches)*Math.PI*2

const randomX=Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1)
const randomY=Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1)
const randomZ=Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()<0.5?1:-1)

positions[i3]=Math.cos(branchAngle+spinAngle)*radius+randomX
positions[i3+1]=randomY
positions[i3+2]=Math.sin(branchAngle+spinAngle)*radius+randomZ

const mixed=colorInside.clone()
mixed.lerp(colorOutside,radius/parameters.radius)

colors[i3]=mixed.r
colors[i3+1]=mixed.g
colors[i3+2]=mixed.b
}

geometry.setAttribute('position',new THREE.BufferAttribute(positions,3))
geometry.setAttribute('color',new THREE.BufferAttribute(colors,3))

points=new THREE.Points(geometry,material)
scene.add(points)
}

generateGalaxy()

/**
 * IMAGEN CENTRAL
 */
const textureLoader=new THREE.TextureLoader()
const centerTexture=textureLoader.load("Dandadan.png")

const centerGeo=new THREE.CircleGeometry(0.7,64)
const centerMat=new THREE.MeshBasicMaterial({
map:centerTexture,
transparent:true,
depthWrite:false
})

const centerImage=new THREE.Mesh(centerGeo,centerMat)
centerImage.renderOrder=1
scene.add(centerImage)

/**
 * FRASES
 */
const frases=[ "Te amo","Eres mi reina","Mi corazón es tuyo","No puedo vivir sin ti","Eres mi razón de ser",
"Mi vida eres tú","Te necesito siempre","Eres mi todo","Mi alma te pertenece","Eres mi inspiración",
"Te pienso día y noche","Eres mi sueño hecho realidad","Mi felicidad eres tú","Te extraño cada segundo",
"Eres mi luz en la oscuridad","Mi mundo gira por ti","Te adoro con el alma","Eres mi paz",
"Mi sonrisa nace de ti","Te llevo en mi corazón","Eres mi destino","Mi vida sin ti no existe" ]

const textGroup=new THREE.Group()
scene.add(textGroup)

const fontLoader=new FontLoader()

fontLoader.load(
"https://unpkg.com/three@0.132.2/examples/fonts/helvetiker_regular.typeface.json",
(font)=>{

frases.forEach((texto,i)=>{

const geo=new TextGeometry(texto,{
font:font,
size:0.12,
height:0.01,
curveSegments:6
})

geo.center()

const mat=new THREE.MeshBasicMaterial({
color:0xffffff,
transparent:true,
opacity:0.9
})

const mesh=new THREE.Mesh(geo,mat)

const angle=(i/frases.length)*Math.PI*2
const radius=2.5

mesh.position.x=Math.cos(angle)*radius
mesh.position.z=Math.sin(angle)*radius
mesh.position.y=(Math.random()-0.5)*1.5

mesh.lookAt(0,0,0)

textGroup.add(mesh)
})
})

/**
 * SIZES
 */
const sizes={width:window.innerWidth,height:window.innerHeight}

window.addEventListener('resize',()=>{
sizes.width=window.innerWidth
sizes.height=window.innerHeight

camera.aspect=sizes.width/sizes.height
camera.updateProjectionMatrix()

renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})

/**
 * CAMERA
 */
const camera=new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1,100)
camera.position.set(3,3,3)
scene.add(camera)

/**
 * CONTROLS
 */
const controls=new OrbitControls(camera,canvas)
controls.enableDamping=true

/**
 * RENDERER
 */
const renderer=new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

/**
 * ANIMATE
 */
const clock=new THREE.Clock()

const tick=()=>{
const elapsed=clock.getElapsedTime()

controls.update()

camera.position.x=Math.cos(elapsed*0.05)*4
camera.position.z=Math.sin(elapsed*0.05)*4
camera.lookAt(0,0,0)

textGroup.rotation.y+=0.002

renderer.render(scene,camera)
requestAnimationFrame(tick)
}

tick()






