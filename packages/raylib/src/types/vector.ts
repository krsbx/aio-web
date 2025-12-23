export interface Vector2Value {
  x: number;
  y: number;
}

export interface Vector3Value extends Vector2Value {
  z: number;
}

export type RawVector2 = bigint;

export type RawVector3 = [xy: bigint, zPadding: bigint];
