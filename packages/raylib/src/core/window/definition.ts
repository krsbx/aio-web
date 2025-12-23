import { type FFIFunction, FFIType } from 'bun:ffi';

export const WindowDefinition = {
  InitWindow: {
    args: [FFIType.i32, FFIType.i32, FFIType.ptr],
    returns: FFIType.void,
  },
  CloseWindow: {
    args: [],
    returns: FFIType.void,
  },
  WindowShouldClose: {
    args: [],
    returns: FFIType.bool,
  },
  IsWindowReady: {
    args: [],
    returns: FFIType.bool,
  },
  IsWindowFullscreen: {
    args: [],
    returns: FFIType.bool,
  },
  IsWindowHidden: {
    args: [],
    returns: FFIType.bool,
  },
  IsWindowMinimized: {
    args: [],
    returns: FFIType.bool,
  },
  IsWindowMaximized: {
    args: [],
    returns: FFIType.bool,
  },
  IsWindowFocused: {
    args: [],
    returns: FFIType.bool,
  },
  IsWindowResized: {
    args: [],
    returns: FFIType.bool,
  },
  IsWindowState: {
    args: [FFIType.i32],
    returns: FFIType.bool,
  },
  SetWindowState: {
    args: [FFIType.i32],
    returns: FFIType.void,
  },
  ClearWindowState: {
    args: [FFIType.i32],
    returns: FFIType.void,
  },
  ToggleFullscreen: {
    args: [],
    returns: FFIType.void,
  },
  ToggleBorderlessWindowed: {
    args: [],
    returns: FFIType.void,
  },
  MaximizeWindow: {
    args: [],
    returns: FFIType.void,
  },
  MinimizeWindow: {
    args: [],
    returns: FFIType.void,
  },
  RestoreWindow: {
    args: [],
    returns: FFIType.void,
  },
  SetWindowIcon: {
    args: [FFIType.u64, FFIType.u64, FFIType.u64, FFIType.i32],
    returns: FFIType.void,
  },
  SetWindowIcons: {
    args: [FFIType.ptr, FFIType.i32],
    returns: FFIType.void,
  },
  SetWindowTitle: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  SetWindowPosition: {
    args: [FFIType.i32, FFIType.i32],
    returns: FFIType.void,
  },
  SetWindowMonitor: {
    args: [FFIType.i32],
    returns: FFIType.void,
  },
  SetWindowMinSize: {
    args: [FFIType.i32, FFIType.i32],
    returns: FFIType.void,
  },
  SetWindowMaxSize: {
    args: [FFIType.i32, FFIType.i32],
    returns: FFIType.void,
  },
  SetWindowSize: {
    args: [FFIType.i32, FFIType.i32],
    returns: FFIType.void,
  },
  SetWindowOpacity: {
    args: [FFIType.f32],
    returns: FFIType.void,
  },
  SetWindowFocused: {
    args: [],
    returns: FFIType.void,
  },
  GetWindowHandle: {
    args: [],
    returns: FFIType.ptr,
  },
  GetScreenWidth: {
    args: [],
    returns: FFIType.i32,
  },
  GetScreenHeight: {
    args: [],
    returns: FFIType.i32,
  },
  GetRenderWidth: {
    args: [],
    returns: FFIType.i32,
  },
  GetRenderHeight: {
    args: [],
    returns: FFIType.i32,
  },
  GetMonitorCount: {
    args: [],
    returns: FFIType.i32,
  },
  GetCurrentMonitor: {
    args: [],
    returns: FFIType.i32,
  },
  GetMonitorPosition: {
    args: [FFIType.i32],
    returns: FFIType.ptr,
  },
  GetMonitorWidth: {
    args: [FFIType.i32],
    returns: FFIType.i32,
  },
  GetMonitorHeight: {
    args: [FFIType.i32],
    returns: FFIType.i32,
  },
  GetMonitorPhysicalWidth: {
    args: [FFIType.i32],
    returns: FFIType.i32,
  },
  GetMonitorPhysicalHeight: {
    args: [FFIType.i32],
    returns: FFIType.i32,
  },
  GetMonitorRefreshRate: {
    args: [FFIType.i32],
    returns: FFIType.i32,
  },
  GetWindowPosition: {
    args: [],
    returns: FFIType.ptr,
  },
  GetWindowScaleDPI: {
    args: [],
    returns: FFIType.ptr,
  },
  GetMonitorName: {
    args: [FFIType.i32],
    returns: FFIType.cstring,
  },
  SetClipboardText: {
    args: [FFIType.ptr],
    returns: FFIType.void,
  },
  GetClipboardText: {
    args: [],
    returns: FFIType.cstring,
  },
  GetClipboardImage: {
    args: [],
    returns: FFIType.ptr,
  },
  EnableEventWaiting: {
    args: [],
    returns: FFIType.void,
  },
  DisableEventWaiting: {
    args: [],
    returns: FFIType.void,
  },

  // BeginDrawing: { returns: 'void' },
  // EndDrawing: { returns: 'void' },
  // ClearBackground: { args: ['u32'], returns: 'void' },
  // SetTargetFPS: { args: ['i32'], returns: 'void' },
  // BeginMode3D: { args: ['ptr'], returns: 'void' },
  // EndMode3D: { returns: 'void' },
  // DrawCube: {
  //   args: ['float', 'float', 'float', 'float', 'float', 'float', 'u32'],
  //   returns: 'void',
  // },
  // DrawGrid: { args: ['i32', 'float'], returns: 'void' },
} satisfies Record<string, FFIFunction>;
