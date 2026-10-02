import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { animationDuration, animationPose, blendPose, type MascotAnimation } from './mascotMotion';

const asset = (name: string) => `${import.meta.env.BASE_URL}mascot/${name}`;
// Keep one CPU template for stage changes; each canvas owns and disposes its GPU copies.
let modelTemplate: Promise<THREE.Group> | undefined;
function loadModel() {
  return modelTemplate ??= new GLTFLoader().loadAsync(asset('t1ger-head-v1.glb')).then(gltf => gltf.scene).catch(error => { modelTemplate = undefined; throw error; });
}

export default function Mascot3D({ celebrate = false, animation = celebrate ? 'celebrate' : 'idle', replay = 0, slow = false, onReady, onComplete, onUnavailable }: {
  celebrate?: boolean; animation?: MascotAnimation; replay?: number; slow?: boolean; onReady?: () => void; onComplete?: () => void; onUnavailable?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef({ animation, replay, slow, onReady, onComplete, onUnavailable });
  controls.current = { animation, replay, slow, onReady, onComplete, onUnavailable };
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const refreshFrame = useRef<() => void>(() => {});
  useEffect(() => { refreshFrame.current(); }, [replay, animation]);

  useEffect(() => {
    const element = host.current!;
    const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { setFailed(true); controls.current.onUnavailable?.(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.setClearColor(0, 0);
    renderer.domElement.setAttribute('aria-hidden', 'true');
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 20);
    camera.position.set(0, .38, 4.1);
    camera.lookAt(0, .32, 0);
    scene.add(new THREE.HemisphereLight('#fff2df', '#30241e', 1.15));
    const keyLight = new THREE.DirectionalLight('#fff1de', 2.5);
    keyLight.position.set(-3, 4, 5); scene.add(keyLight);
    const fill = new THREE.DirectionalLight('#dce8ff', .75);
    fill.position.set(4, 1, 3); scene.add(fill);
    const rim = new THREE.DirectionalLight('#ffbb78', 1.7);
    rim.position.set(1, 3, -3); scene.add(rim);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 64;
    const context = shadowCanvas.getContext('2d')!;
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(0,0,0,.65)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient; context.fillRect(0, 0, 64, 64);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.35, .45), shadowMaterial);
    shadow.position.set(0, -.82, -.25); scene.add(shadow);

    const starShape = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4, radius = i % 2 ? .045 : .14;
      const x = Math.cos(angle) * radius, y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y); else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starGeometry = new THREE.ShapeGeometry(starShape);
    const stars = Array.from({ length: 7 }, (_, i) => {
      const star = new THREE.Mesh(starGeometry, new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffe9a4' : '#ff9e35', transparent: true, depthWrite: false }));
      star.visible = false; scene.add(star); return star;
    });
    let disposed = false, model: THREE.Group | undefined, frameId = 0, previousTime = 0, elapsed = 0;
    let shotTime = controls.current.animation === 'idle' ? animationDuration('idle') : 0;
    let lastReplay = controls.current.replay, lastAnimation = controls.current.animation, visible = true;
    let renderedPose = animationPose('idle', 0), transitionFrom = renderedPose;
    let expressions: { leftEye?: THREE.Object3D; rightEye?: THREE.Object3D; leftBrow?: THREE.Object3D; rightBrow?: THREE.Object3D; leftEar?: THREE.Object3D; rightEar?: THREE.Object3D; smile?: THREE.Object3D } = {};
    const base = new Map<THREE.Object3D, THREE.Euler>();
    const render = (timestamp: number) => {
      frameId = 0;
      if (disposed || !visible || document.hidden || !model) return;
      const delta = previousTime ? Math.min((timestamp - previousTime) / 1000, .05) : 0;
      previousTime = timestamp;
      const control = controls.current;
      if (control.replay !== lastReplay || control.animation !== lastAnimation) {
        transitionFrom = { ...renderedPose, ry: Math.atan2(Math.sin(renderedPose.ry), Math.cos(renderedPose.ry)) };
        shotTime = 0; lastReplay = control.replay;
      }
      lastAnimation = control.animation;
      elapsed += delta;
      const duration = animationDuration(control.animation);
      const wasPlaying = shotTime < duration;
      // Reduced motion suppresses autoplay; an explicit Replay requests this one shot.
      shotTime = motionPreference.matches && control.replay === 0 ? duration : Math.min(duration, shotTime + delta * (control.slow ? .5 : 1));
      const playing = shotTime < duration;
      const targetPose = animationPose(control.animation, shotTime);
      const pose = blendPose(transitionFrom, targetPose, shotTime / .18);
      renderedPose = pose;
      const breath = motionPreference.matches ? 0 : Math.sin(elapsed * 1.5) * .009;
      model.position.y = pose.y + (playing ? 0 : breath);
      model.rotation.set(pose.rx, pose.ry + (playing || motionPreference.matches ? 0 : Math.sin(elapsed * .6) * .035), pose.rz);
      model.scale.set(.94 * pose.sx, pose.sy, 1 / Math.sqrt(pose.sx * pose.sy));
      const blinkPhase = elapsed % 4.7;
      const blink = !playing && !motionPreference.matches && blinkPhase > 4.4 ? Math.max(.06, Math.abs((blinkPhase - 4.55) / .15)) : 1;
      if (expressions.leftEye) expressions.leftEye.scale.y = pose.eye * blink;
      if (expressions.rightEye) expressions.rightEye.scale.y = pose.eyeRight * blink;
      if (expressions.leftBrow) expressions.leftBrow.rotation.z = base.get(expressions.leftBrow)!.z + pose.brow;
      if (expressions.rightBrow) expressions.rightBrow.rotation.z = base.get(expressions.rightBrow)!.z - pose.brow;
      const earFollow = playing ? Math.sin((shotTime - .12) * 12) * .15 * Math.sin(Math.PI * shotTime / duration) : motionPreference.matches ? 0 : Math.sin(elapsed * 1.3) * .018;
      if (expressions.leftEar) expressions.leftEar.rotation.z = base.get(expressions.leftEar)!.z + earFollow;
      if (expressions.rightEar) expressions.rightEar.rotation.z = base.get(expressions.rightEar)!.z - earFollow * .8;
      if (expressions.smile) expressions.smile.scale.y = 1 + pose.brow * 1.4;
      shadow.scale.x = 1 - Math.max(0, pose.y) * .45;
      shadowMaterial.opacity = .75 - Math.max(0, pose.y) * .65;
      stars.forEach((star, i) => {
        const celebration = control.animation === 'celebrate' || control.animation === 'milestone';
        const life = (shotTime - (celebration ? 1.56 : .45) - i * .028) / (celebration ? 1.25 : .65);
        star.visible = playing && (celebration || (control.animation === 'saved' && i < 3)) && life > 0 && life < 1;
        if (!star.visible) return;
        const angle = Math.PI * (.12 + i * .76 / 6), radius = 1.12 + life * .75;
        star.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius - life * life * .7 + .05, .4);
        star.rotation.z = life * (i % 2 ? -1 : 1) * 3;
        star.scale.setScalar(Math.sin(Math.PI * life) * (.7 + (i % 3) * .25) * (control.animation === 'milestone' ? 1.2 : 1));
        star.material.opacity = 1 - life * life;
      });
      renderer.render(scene, camera);
      if (wasPlaying && !playing) control.onComplete?.();
      if (!motionPreference.matches || playing) frameId = requestAnimationFrame(render);
    };
    const refresh = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0; previousTime = 0;
      if (visible && !document.hidden && model && !disposed) frameId = requestAnimationFrame(render);
    };
    refreshFrame.current = refresh;
    const observer = new ResizeObserver(() => {
      const width = element.clientWidth, height = element.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); refresh();
    }); observer.observe(element);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); }); intersection.observe(element);
    document.addEventListener('visibilitychange', refresh);
    motionPreference.addEventListener('change', refresh);
    const disposeModel = (object: THREE.Object3D) => object.traverse(node => {
      if (node instanceof THREE.Mesh) { node.geometry.dispose(); for (const material of Array.isArray(node.material) ? node.material : [node.material]) material.dispose(); }
    });
    void loadModel().then(template => {
      if (disposed) return;
      model = template.clone(true);
      model.traverse(node => {
        if (node instanceof THREE.Mesh) {
          node.geometry = node.geometry.clone();
          node.material = Array.isArray(node.material) ? node.material.map(material => material.clone()) : node.material.clone();
        }
      });
      expressions = Object.fromEntries(['leftEye', 'rightEye', 'leftBrow', 'rightBrow', 'leftEar', 'rightEar', 'Smile'].map(name => [name === 'Smile' ? 'smile' : name, model!.getObjectByName(name)]));
      Object.values(expressions).forEach(node => { if (node) base.set(node, node.rotation.clone()); });
      scene.add(model); setReady(true); controls.current.onReady?.(); refresh();
    }).catch(() => { if (!disposed) { setFailed(true); controls.current.onUnavailable?.(); } });
    return () => {
      disposed = true; cancelAnimationFrame(frameId); observer.disconnect(); intersection.disconnect();
      refreshFrame.current = () => {};
      document.removeEventListener('visibilitychange', refresh); motionPreference.removeEventListener('change', refresh);
      if (model) disposeModel(model);
      shadow.geometry.dispose(); shadowMaterial.dispose(); shadowTexture.dispose(); starGeometry.dispose(); stars.forEach(star => star.material.dispose());
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div className={`mascot-render ${ready ? 'is-ready' : ''}`} aria-hidden="true">
    <img className="mascot-poster" src={asset('t1ger-avatar.png')} alt=""/>
    <div ref={host} className="mascot-canvas"/>
    {failed && <span className="sr-only">Static mascot fallback</span>}
  </div>;
}
