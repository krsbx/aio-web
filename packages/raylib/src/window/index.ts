import { ptr } from 'bun:ffi';
import type { RayLib } from '../types';
import type { ImageValue } from '../types/image';
import type { Vector2Value } from '../types/vector';
import type { WidthHeight } from '../types/window';
import { Image } from '../utils/image';
import { Vector2 } from '../utils/vector';
import type { ConfigFlags } from './constants';

export function initWindow(
  this: RayLib,
  options: WidthHeight & {
    title: string;
  }
) {
  this.symbol.InitWindow(
    options.width,
    options.height,
    ptr(Buffer.from(options.title, 'utf-8'))
  );
}

export function closeWindow(this: RayLib) {
  this.symbol.CloseWindow();
}

export function windowShouldClose(this: RayLib) {
  return this.symbol.WindowShouldClose();
}

export function isWindowReady(this: RayLib) {
  return this.symbol.IsWindowReady();
}

export function isWindowFullscreen(this: RayLib) {
  return this.symbol.IsWindowFullscreen();
}

export function isWindowHidden(this: RayLib) {
  return this.symbol.IsWindowHidden();
}

export function isWindowMinimized(this: RayLib) {
  return this.symbol.IsWindowMinimized();
}

export function isWindowMaximized(this: RayLib) {
  return this.symbol.IsWindowMaximized();
}

export function isWindowFocused(this: RayLib) {
  return this.symbol.IsWindowFocused();
}

export function isWindowResized(this: RayLib) {
  return this.symbol.IsWindowResized();
}

export function isWindowState(this: RayLib, flag: ConfigFlags) {
  return this.symbol.IsWindowState(flag);
}

export function setWindowState(this: RayLib, flags: ConfigFlags) {
  this.symbol.SetWindowState(flags);
}

export function clearWindowState(this: RayLib, flags: ConfigFlags) {
  this.symbol.ClearWindowState(flags);
}

export function toggleFullscreen(this: RayLib) {
  this.symbol.ToggleFullscreen();
}

export function toggleBorderlessWindowed(this: RayLib) {
  this.symbol.ToggleBorderlessWindowed();
}

export function maximizeWindow(this: RayLib) {
  this.symbol.MaximizeWindow();
}

export function minimizeWindow(this: RayLib) {
  this.symbol.MinimizeWindow();
}

export function restoreWindow(this: RayLib) {
  this.symbol.RestoreWindow();
}

export function setWindowIcon(this: RayLib, image: ImageValue) {
  const chunks = Image.pack(image);

  this.symbol.SetWindowIcon(chunks);
}

export function setWindowIcons(this: RayLib, images: ImageValue[]) {
  const count = images.length;
  const buffer = Image.packs(images);

  this.symbol.SetWindowIcons(ptr(buffer), count);
}

export function setWindowTitle(this: RayLib, title: string) {
  this.symbol.SetWindowTitle(ptr(Buffer.from(title, 'utf-8')));
}

export function setWindowPosition(this: RayLib, options: Vector2Value) {
  this.symbol.SetWindowPosition(options.x, options.y);
}

export function setWindowMonitor(this: RayLib, monitor: number) {
  this.symbol.SetWindowMonitor(monitor);
}

export function setWindowMinSize(this: RayLib, options: WidthHeight) {
  this.symbol.SetWindowMinSize(options.width, options.height);
}

export function setWindowMaxSize(this: RayLib, options: WidthHeight) {
  this.symbol.SetWindowMaxSize(options.width, options.height);
}

export function setWindowSize(this: RayLib, options: WidthHeight) {
  this.symbol.SetWindowSize(options.width, options.height);
}

export function setWindowOpacity(this: RayLib, opacity: number) {
  this.symbol.SetWindowOpacity(opacity);
}

export function setWindowFocused(this: RayLib) {
  this.symbol.SetWindowFocused();
}

export function getWindowHandle(this: RayLib) {
  return this.symbol.GetWindowHandle();
}

export function getScreenWidth(this: RayLib) {
  return this.symbol.GetScreenWidth();
}
export function getScreenHeight(this: RayLib) {
  return this.symbol.GetScreenHeight();
}
export function getRenderWidth(this: RayLib) {
  return this.symbol.GetRenderWidth();
}
export function getRenderHeight(this: RayLib) {
  return this.symbol.GetRenderHeight();
}
export function getMonitorCount(this: RayLib) {
  return this.symbol.GetMonitorCount();
}
export function getCurrentMonitor(this: RayLib) {
  return this.symbol.GetCurrentMonitor();
}

export function getMonitorPosition(this: RayLib, monitor: number) {
  const chunk = this.symbol.GetMonitorPosition(monitor);

  return Vector2.unpack(chunk);
}

export function getMonitorWidth(this: RayLib, monitor: number) {
  return this.symbol.GetMonitorWidth(monitor);
}

export function getMonitorHeight(this: RayLib, monitor: number) {
  return this.symbol.GetMonitorHeight(monitor);
}

export function getMonitorPhysicalWidth(this: RayLib, monitor: number) {
  return this.symbol.GetMonitorPhysicalWidth(monitor);
}

export function getMonitorPhysicalHeight(this: RayLib, monitor: number) {
  return this.symbol.GetMonitorPhysicalHeight(monitor);
}

export function getMonitorRefreshRate(this: RayLib, monitor: number) {
  return this.symbol.GetMonitorRefreshRate(monitor);
}

export function GetWindowPosition(this: RayLib) {
  const chunk = this.symbol.GetWindowPosition();

  return Vector2.unpack(chunk);
}

export function getWindowScaleDPI(this: RayLib) {
  const chunk = this.symbol.GetWindowScaleDPI();

  return Vector2.unpack(chunk);
}

export function getMonitorName(this: RayLib, monitor: number) {
  return this.symbol.GetMonitorName(monitor);
}

export function setClipboardText(this: RayLib, text: string) {
  this.symbol.SetClipboardText(ptr(Buffer.from(text, 'utf-8')));
}

export function getClipboardText(this: RayLib) {
  return this.symbol.GetClipboardText();
}

export function getClipboardImage(this: RayLib) {
  const chunks = this.symbol.GetClipboardImage();

  return Image.unpackFromPointer(chunks);
}

export function enableEventWaiting(this: RayLib) {
  this.symbol.EnableEventWaiting();
}

export function disableEventWaiting(this: RayLib) {
  this.symbol.DisableEventWaiting();
}
