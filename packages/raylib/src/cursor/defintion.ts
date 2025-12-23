import { type FFIFunction, FFIType } from 'bun:ffi';

export const CursorDefinition = {
  ShowCursor: {
    args: [],
    returns: FFIType.void,
  },
  HideCursor: {
    args: [],
    returns: FFIType.void,
  },
  IsCursorHidden: {
    args: [],
    returns: FFIType.bool,
  },
  EnableCursor: {
    args: [],
    returns: FFIType.void,
  },
  DisableCursor: {
    args: [],
    returns: FFIType.void,
  },
  IsCursorOnScreen: {
    args: [],
    returns: FFIType.void,
  },
} satisfies Record<string, FFIFunction>;
