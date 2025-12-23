import { type FFIFunction, FFIType } from 'bun:ffi';
export const DrawingDefinition = {
  ClearBackground: {
    args: [FFIType.u32],
    returns: FFIType.void,
  },
  BeginDrawing: {
    args: [],
    returns: FFIType.void,
  },
  EndDrawing: {
    args: [],
    returns: FFIType.void,
  },
  BeginMode2D: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  EndMode2D: {
    args: [],
    returns: FFIType.void,
  },
  BeginMode3D: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  EndMode3D: {
    args: [],
    returns: FFIType.void,
  },
  BeginTextureMode: {
    // Todo: Add Texture2D type
    returns: FFIType.void,
  },
  EndTextureMode: {
    args: [],
    returns: FFIType.void,
  },
  BeginShaderMode: {
    // Todo: Add Texture2D type
    returns: FFIType.void,
  },
  EndShaderMode: {
    args: [],
    returns: FFIType.void,
  },
  BeginBlendMode: {
    args: [FFIType.i32],
    returns: FFIType.void,
  },
  EndBlendMode: {
    args: [],
    returns: FFIType.void,
  },
  BeginScissorMode: {
    args: [FFIType.i32, FFIType.i32, FFIType.i32, FFIType.i32],
    returns: FFIType.void,
  },
  EndScissorMode: {
    args: [],
    returns: FFIType.void,
  },
  BeginVrStereoMode: {
    // Todo: Add stereo config
    returns: FFIType.void,
  },
  EndVrStereoMode: {
    args: [],
    returns: FFIType.void,
  },
} satisfies Record<string, FFIFunction>;
