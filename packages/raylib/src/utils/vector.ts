import type {
  RawVector2,
  RawVector3,
  Vector2Value,
  Vector3Value,
} from '../types/vector';

// Max size for Vector3 (with padding)
const conversionBuffer = new ArrayBuffer(16);
const u64View = new BigUint64Array(conversionBuffer);
const f32View = new Float32Array(conversionBuffer);

export class Vector2 {
  public static pack(value: Vector2Value) {
    f32View[0] = value.x;
    f32View[1] = value.y;

    return u64View[0] as RawVector2;
  }

  public static unpack(chunk: RawVector2) {
    u64View[0] = chunk;

    return {
      x: f32View[0],
      y: f32View[1],
    } as Vector2Value;
  }
}

export class Vector3 {
  public static pack(value: Vector3Value) {
    f32View[0] = value.x;
    f32View[1] = value.y;
    f32View[2] = value.z;
    f32View[3] = 0.0;

    return [u64View[0], u64View[1]] as RawVector3;
  }

  public unpack(chunks: RawVector3) {
    u64View[0] = chunks[0];
    u64View[1] = chunks[1];

    return {
      x: f32View[0],
      y: f32View[1],
      z: f32View[2],
    } as Vector3Value;
  }
}
