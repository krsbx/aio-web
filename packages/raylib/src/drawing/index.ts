import { ptr } from 'bun:ffi';
import type { RayLib, ToDo } from '../types';
import type { Vector2Value } from '../types/vector';
import type { WidthHeight } from '../types/window';
import type { BlendMode } from './constants';

export function clearBackground(this: RayLib, color: number) {
  this.symbol.ClearBackground(color);
}

export function beginDrawing(this: RayLib) {
  this.symbol.BeginDrawing();
}

export function endDrawing(this: RayLib) {
  this.symbol.EndDrawing();
}

export function beginMode2D(this: RayLib) {
  this.symbol.BeginMode2D();
}

export function endMode2D(this: RayLib) {
  this.symbol.EndMode2D();
}

export function beginMode3D(this: RayLib, camera: Float64Array) {
  this.symbol.BeginMode3D(ptr(camera));
}

export function endMode3D(this: RayLib) {
  this.symbol.EndMode3D();
}

export function beginTextureMode(this: RayLib, target: ToDo) {
  this.symbol.BeginTextureMode(target);
}

export function endTextureMode(this: RayLib) {
  this.symbol.EndTextureMode();
}

export function beginShaderMode(this: RayLib, shader: ToDo) {
  this.symbol.BeginShaderMode(shader);
}

export function endShaderMode(this: RayLib) {
  this.symbol.EndShaderMode();
}

export function beginBlendMode(this: RayLib, mode: BlendMode) {
  this.symbol.BeginBlendMode(mode);
}

export function endBlendMode(this: RayLib) {
  this.symbol.EndBlendMode();
}

export function beginScissorMode(
  this: RayLib,
  options: Vector2Value & WidthHeight
) {
  this.symbol.BeginScissorMode(
    options.x,
    options.y,
    options.width,
    options.height
  );
}

export function endScissorMode(this: RayLib) {
  this.symbol.EndScissorMode();
}

export function beginVrStereoMode(this: RayLib, config: ToDo) {
  this.symbol.BeginVrStereoMode(config);
}

export function endVrStereoMode(this: RayLib) {
  this.symbol.EndVrStereoMode();
}
