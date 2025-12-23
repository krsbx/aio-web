import { ptr } from 'bun:ffi';
import type { RayLib, ToDo } from '../../types';
import type { Camera2DValue, Camera3DValue } from '../../types/camera';
import type { Vector2Value } from '../../types/vector';
import type { WidthHeight } from '../../types/window';
import { Camera2D, Camera3D } from '../../utils/camera';
import type { BlendMode } from './constants';

export function clearBackground(this: RayLib, color: number) {
  this.symbols.ClearBackground(color);
}

export function beginDrawing(this: RayLib) {
  this.symbols.BeginDrawing();
}

export function endDrawing(this: RayLib) {
  this.symbols.EndDrawing();
}

export function beginMode2D(this: RayLib, camera: Camera2DValue) {
  const chunks = Camera2D.pack(camera);

  this.symbols.BeginMode2D(chunks);
}

export function endMode2D(this: RayLib) {
  this.symbols.EndMode2D();
}

export function beginMode3D(this: RayLib, camera: Camera3DValue) {
  const chunks = Camera3D.pack(camera);

  this.symbols.BeginMode3D(ptr(chunks));
}

export function endMode3D(this: RayLib) {
  this.symbols.EndMode3D();
}

export function beginTextureMode(this: RayLib, target: ToDo) {
  this.symbols.BeginTextureMode(target);
}

export function endTextureMode(this: RayLib) {
  this.symbols.EndTextureMode();
}

export function beginShaderMode(this: RayLib, shader: ToDo) {
  this.symbols.BeginShaderMode(shader);
}

export function endShaderMode(this: RayLib) {
  this.symbols.EndShaderMode();
}

export function beginBlendMode(this: RayLib, mode: BlendMode) {
  this.symbols.BeginBlendMode(mode);
}

export function endBlendMode(this: RayLib) {
  this.symbols.EndBlendMode();
}

export function beginScissorMode(
  this: RayLib,
  options: Vector2Value & WidthHeight
) {
  this.symbols.BeginScissorMode(
    options.x,
    options.y,
    options.width,
    options.height
  );
}

export function endScissorMode(this: RayLib) {
  this.symbols.EndScissorMode();
}

export function beginVrStereoMode(this: RayLib, config: ToDo) {
  this.symbols.BeginVrStereoMode(config);
}

export function endVrStereoMode(this: RayLib) {
  this.symbols.EndVrStereoMode();
}
