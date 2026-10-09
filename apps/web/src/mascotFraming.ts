import { Box3, Group, type Object3D, Vector3 } from 'three';

/** Animate around the visible character's center, not the exported GLB origin. */
export function centerMascot(character: Object3D) {
  const bounds = new Box3().setFromObject(character);
  character.position.sub(bounds.getCenter(new Vector3()));
  const rig = new Group();
  rig.add(character);
  return rig;
}

/** One centered frame at every host size, with room for the authored jump. */
export function mascotFrame(aspect: number) {
  const height = Math.max(3.15, 3.15 / aspect);
  return { left: -height * aspect / 2, right: height * aspect / 2, top: height / 2, bottom: -height / 2 };
}
