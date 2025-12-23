import { ptr } from 'bun:ffi';
import type { RayLib } from '../../types';
import type { ImageValue } from '../../types/image';
import type { Vector2Value } from '../../types/vector';
import type { WidthHeight } from '../../types/window';
import { Image } from '../../utils/image';
import { Vector2 } from '../../utils/vector';
import type { ConfigFlags } from './constants';

export function initWindow(
  this: RayLib,
  options: WidthHeight & {
    title: string;
  }
) {
  this.symbols.InitWindow(
    options.width,
    options.height,
    Buffer.from(options.title, 'utf-8')
  );
}

export function closeWindow(this: RayLib) {
  this.symbols.CloseWindow();
}

export function windowShouldClose(this: RayLib) {
  return this.symbols.WindowShouldClose();
}

export function isWindowReady(this: RayLib) {
  return this.symbols.IsWindowReady();
}

export function isWindowFullscreen(this: RayLib) {
  return this.symbols.IsWindowFullscreen();
}

export function isWindowHidden(this: RayLib) {
  return this.symbols.IsWindowHidden();
}

export function isWindowMinimized(this: RayLib) {
  return this.symbols.IsWindowMinimized();
}

export function isWindowMaximized(this: RayLib) {
  return this.symbols.IsWindowMaximized();
}

export function isWindowFocused(this: RayLib) {
  return this.symbols.IsWindowFocused();
}

export function isWindowResized(this: RayLib) {
  return this.symbols.IsWindowResized();
}

export function isWindowState(this: RayLib, flag: ConfigFlags) {
  return this.symbols.IsWindowState(flag);
}

export function setWindowState(this: RayLib, flags: ConfigFlags) {
  this.symbols.SetWindowState(flags);
}

export function clearWindowState(this: RayLib, flags: ConfigFlags) {
  this.symbols.ClearWindowState(flags);
}

export function toggleFullscreen(this: RayLib) {
  this.symbols.ToggleFullscreen();
}

export function toggleBorderlessWindowed(this: RayLib) {
  this.symbols.ToggleBorderlessWindowed();
}

export function maximizeWindow(this: RayLib) {
  this.symbols.MaximizeWindow();
}

export function minimizeWindow(this: RayLib) {
  this.symbols.MinimizeWindow();
}

export function restoreWindow(this: RayLib) {
  this.symbols.RestoreWindow();
}

export function setWindowIcon(this: RayLib, image: ImageValue) {
  const chunks = Image.pack(image);

  this.symbols.SetWindowIcon(chunks);
}

export function setWindowIcons(this: RayLib, images: ImageValue[]) {
  const count = images.length;
  const buffer = Image.packs(images);

  this.symbols.SetWindowIcons(ptr(buffer), count);
}

export function setWindowTitle(this: RayLib, title: string) {
  this.symbols.SetWindowTitle(ptr(Buffer.from(title, 'utf-8')));
}

export function setWindowPosition(this: RayLib, options: Vector2Value) {
  this.symbols.SetWindowPosition(options.x, options.y);
}

export function setWindowMonitor(this: RayLib, monitor: number) {
  this.symbols.SetWindowMonitor(monitor);
}

export function setWindowMinSize(this: RayLib, options: WidthHeight) {
  this.symbols.SetWindowMinSize(options.width, options.height);
}

export function setWindowMaxSize(this: RayLib, options: WidthHeight) {
  this.symbols.SetWindowMaxSize(options.width, options.height);
}

export function setWindowSize(this: RayLib, options: WidthHeight) {
  this.symbols.SetWindowSize(options.width, options.height);
}

export function setWindowOpacity(this: RayLib, opacity: number) {
  this.symbols.SetWindowOpacity(opacity);
}

export function setWindowFocused(this: RayLib) {
  this.symbols.SetWindowFocused();
}

export function getWindowHandle(this: RayLib) {
  return this.symbols.GetWindowHandle();
}

export function getScreenWidth(this: RayLib) {
  return this.symbols.GetScreenWidth();
}
export function getScreenHeight(this: RayLib) {
  return this.symbols.GetScreenHeight();
}
export function getRenderWidth(this: RayLib) {
  return this.symbols.GetRenderWidth();
}
export function getRenderHeight(this: RayLib) {
  return this.symbols.GetRenderHeight();
}
export function getMonitorCount(this: RayLib) {
  return this.symbols.GetMonitorCount();
}
export function getCurrentMonitor(this: RayLib) {
  return this.symbols.GetCurrentMonitor();
}

export function getMonitorPosition(this: RayLib, monitor: number) {
  const chunk = this.symbols.GetMonitorPosition(monitor);

  return Vector2.unpack(chunk);
}

export function getMonitorWidth(this: RayLib, monitor: number) {
  return this.symbols.GetMonitorWidth(monitor);
}

export function getMonitorHeight(this: RayLib, monitor: number) {
  return this.symbols.GetMonitorHeight(monitor);
}

export function getMonitorPhysicalWidth(this: RayLib, monitor: number) {
  return this.symbols.GetMonitorPhysicalWidth(monitor);
}

export function getMonitorPhysicalHeight(this: RayLib, monitor: number) {
  return this.symbols.GetMonitorPhysicalHeight(monitor);
}

export function getMonitorRefreshRate(this: RayLib, monitor: number) {
  return this.symbols.GetMonitorRefreshRate(monitor);
}

export function getWindowPosition(this: RayLib) {
  const chunk = this.symbols.GetWindowPosition();

  return Vector2.unpack(chunk);
}

export function getWindowScaleDPI(this: RayLib) {
  const chunk = this.symbols.GetWindowScaleDPI();

  return Vector2.unpack(chunk);
}

export function getMonitorName(this: RayLib, monitor: number) {
  return this.symbols.GetMonitorName(monitor);
}

export function setClipboardText(this: RayLib, text: string) {
  this.symbols.SetClipboardText(ptr(Buffer.from(text, 'utf-8')));
}

export function getClipboardText(this: RayLib) {
  return this.symbols.GetClipboardText();
}

export function getClipboardImage(this: RayLib) {
  const chunks = this.symbols.GetClipboardImage();

  return Image.unpackFromPointer(chunks);
}

export function enableEventWaiting(this: RayLib) {
  this.symbols.EnableEventWaiting();
}

export function disableEventWaiting(this: RayLib) {
  this.symbols.DisableEventWaiting();
}
