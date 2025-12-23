import type { Vector2Value, Vector3Value } from './vector';

export interface Camera2DValue {
  offset: Vector2Value;
  target: Vector2Value;
  rotation: number;
  zoom: number;
}

export type RawCamera2D = Float32Array &
  [
    offsetX: number,
    offsetY: number,

    targetX: number,
    targetY: number,

    rotation: number,
    zoom: number,
  ];

export interface Camera3DValue {
  position: Vector3Value;
  target: Vector3Value;
  up: Vector3Value;
  fovy: number;
  projection: number;
}

export type RawCamera3D = Float32Array &
  [
    posX: number,
    posY: number,
    posZ: number,

    targetX: number,
    targetY: number,
    targetZ: number,

    upX: number,
    upY: number,
    upZ: number,

    fovy: number,
    projection: number,
  ];
