export interface ImageValue {
  dataPtr: bigint;
  width: number;
  height: number;
  mipmaps: number;
  format: number;
}

export type RawImage = [
  data: bigint,
  widthHeight: bigint,
  mipmapsFormat: bigint,
];
