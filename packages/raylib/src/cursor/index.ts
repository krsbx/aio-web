import type { RayLib } from '../types';

export function ShowCursor(this: RayLib) {
  this.symbol.ShowCursor();
}

export function HideCursor(this: RayLib) {
  this.symbol.HideCursor();
}

export function IsCursorHidden(this: RayLib) {
  this.symbol.IsCursorHidden();
}

export function EnableCursor(this: RayLib) {
  this.symbol.EnableCursor();
}

export function DisableCursor(this: RayLib) {
  this.symbol.DisableCursor();
}

export function IsCursorOnScreen(this: RayLib) {
  this.symbol.IsCursorOnScreen();
}
