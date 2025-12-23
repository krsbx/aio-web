import type {
  Camera2DValue,
  Camera3DValue,
  RawCamera2D,
  RawCamera3D,
} from '../types/camera';

export class Camera2D {
  public static pack(value: Camera2DValue) {
    const camera = new Float32Array([
      value.offset.x,
      value.offset.y,

      value.target.x,
      value.target.y,

      value.rotation,
      value.zoom,
    ]);

    return camera as RawCamera2D;
  }
}

export class Camera3D {
  public static pack(value: Camera3DValue) {
    const camera = new Float32Array([
      value.position.x,
      value.position.y,
      value.position.z,

      value.target.x,
      value.target.y,
      value.target.z,

      value.up.x,
      value.up.y,
      value.up.z,

      value.fovy,
      value.projection,
    ]);

    return camera as RawCamera3D;
  }
}
