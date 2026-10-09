import { readFileSync } from 'node:fs';
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { expect, it } from 'vitest';
import { centerMascot, mascotFrame } from './mascotFraming';
import { animationDuration, animationPose, type MascotAnimation } from './mascotMotion';

it('centers the shipped GLB and keeps every authored pose inside wide and square frames', async () => {
  const bytes = readFileSync(new URL('../public/mascot/t1ger-head-v1.glb', import.meta.url));
  const gltf = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  const rig = centerMascot(gltf.scene);
  expect(new Box3().setFromObject(rig).getCenter(new Vector3()).length()).toBeLessThan(.00001);
  const animations: MascotAnimation[] = ['idle','welcome','thinking','correct','retry','saved','recall','celebrate','milestone'];
  for (const animation of animations) {
    for (let step = 0; step <= 40; step++) {
      const pose = animationPose(animation, animationDuration(animation) * step / 40);
      rig.position.y = pose.y;
      rig.rotation.set(pose.rx, pose.ry, pose.rz);
      rig.scale.set(.94 * pose.sx, pose.sy, 1 / Math.sqrt(pose.sx * pose.sy));
      const bounds = new Box3().setFromObject(rig);
      for (const aspect of [.8, 1, 1.1, 1.68, 2]) {
        const frame = mascotFrame(aspect);
        expect(bounds.min.x, animation).toBeGreaterThan(frame.left);
        expect(bounds.max.x, animation).toBeLessThan(frame.right);
        expect(bounds.min.y, animation).toBeGreaterThan(frame.bottom);
        expect(bounds.max.y, animation).toBeLessThan(frame.top);
      }
    }
  }
});
