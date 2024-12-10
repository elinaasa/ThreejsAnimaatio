import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./assets/qwantani_dusk_2_4k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10).normalize();
  scene.add(directionalLight);
});

const loader = new GLTFLoader();
const mixers = [];

loader.load("./assets/ympyra.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);
  mixers.push(mixer);

  const action = mixer.clipAction(gltf.animations[0]);
  console.log("Pallo2 animations:", gltf.animations);
  action.play();
});

loader.load("./assets/pallo2.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);
  mixers.push(mixer);

  const action = mixer.clipAction(gltf.animations[0]);
  console.log("Pallo2 animations:", gltf.animations);
  action.play();
});

loader.load("./assets/pallo1.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  const mixer = new THREE.AnimationMixer(model);
  mixers.push(mixer);

  const animationName = "CylinderAction.001";
  const animationClip = THREE.AnimationClip.findByName(
    gltf.animations,
    animationName
  );

  if (animationClip) {
    const action = mixer.clipAction(animationClip);

    const frameRate = 60;
    const frameOffsetInSeconds = 60 / frameRate;
    action.setLoop(THREE.LoopRepeat);
    action.startAt(frameOffsetInSeconds).play();
  } else {
    console.error(`Animation "${animationName}" not found in pallo1.glb.`);
  }
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  mixers.forEach((mixer) => mixer.update(delta));

  controls.update();
  renderer.render(scene, camera);
}
animate();

camera.position.z = 5;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
