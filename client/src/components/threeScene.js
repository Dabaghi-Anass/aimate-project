import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export function initScene(size, Model) {
  var size;
  let renderer, controles, scene, camera;
  let robot;
  const loader = new GLTFLoader();

  function load(size, Model) {
    let sceneContainer = document.getElementById("Scene");
    let sceneExist = sceneContainer.hasChildNodes();
    if (sceneExist) return;
    if (renderer || scene || camera) return;
    const { width, height } = size;
    const light = new THREE.AmbientLight({ color: 0x555555 }, 0.5);
    const directionalLight = new THREE.DirectionalLight({ color: 0xffffff }, 1);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

    renderer = new THREE.WebGLRenderer({ alpha: true });
    controles = new OrbitControls(camera, renderer.domElement);
    controles.maxPolarAngle = Math.PI / 1.5;
    controles.enableZoom = false;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    sceneContainer.appendChild(renderer.domElement);
    camera.position.set(10.7, 10.7, 10.7);
    light.position.set(1, 1, 1);
    directionalLight.position.set(1000, 800, 200);
    directionalLight.rotation.set(Math.PI / 4, 0, -Math.PI / 4);
    scene.add(light);
    scene.add(directionalLight);

    loader.load(Model, (gltf) => {
      robot = gltf.scene;
      robot.scale.set(10, 10, 10);
      robot.position.y -= 7;
      scene.add(robot);
    });
    controles.update();
    renderer.render(scene, camera);
  }
  load(size, Model);
  function animate() {
    requestAnimationFrame(animate);
    if (!scene || !renderer || !controles || !camera) return;
    if (robot?.rotation) robot.rotation.y -= 0.01;
    controles.update();
    renderer.render(scene, camera);
  }
  cancelAnimationFrame(animate);
  return animate;
}
