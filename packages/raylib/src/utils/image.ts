import type { ImageValue, RawImage } from '../types/image';

// Allocate 24 bytes for the Image struct
const imgBuffer = new ArrayBuffer(24);
const u64View = new BigUint64Array(imgBuffer);
const i32View = new Int32Array(imgBuffer);
// We need a DataView to handle the 64-bit pointer and 32-bit ints easily
const imgView = new DataView(imgBuffer);

export class Image {
  public static pack(value: ImageValue) {
    imgView.setBigUint64(0, value.dataPtr, true);
    i32View[2] = value.width;
    i32View[3] = value.height;
    i32View[4] = value.mipmaps;
    i32View[5] = value.format;

    return [u64View[0], u64View[1], u64View[2]] as RawImage;
  }

  public static packs(values: ImageValue[]) {
    const count = values.length;
    // Create one big buffer to hold all images (24 bytes each)
    const buffer = new ArrayBuffer(count * 24);
    const i32View = new Int32Array(buffer);
    const imgView = new DataView(buffer);

    values.forEach((img, i) => {
      const i32Offset = i * 6;
      const byteOffset = i * 24;

      imgView.setBigUint64(byteOffset, img.dataPtr, true);

      i32View[i32Offset + 2] = img.width;
      i32View[i32Offset + 3] = img.height;
      i32View[i32Offset + 4] = img.mipmaps;
      i32View[i32Offset + 5] = img.format;
    });

    return buffer;
  }

  public static unpack(chunks: RawImage) {
    u64View[0] = chunks[0];
    u64View[1] = chunks[1];
    u64View[2] = chunks[2];

    return {
      dataPtr: imgView.getBigUint64(0, true),
      width: i32View[2],
      height: i32View[3],
      mipmaps: i32View[4],
      format: i32View[5],
    } as ImageValue;
  }

  public static unpackFromPointer(pointer: NodeJS.TypedArray) {
    const raw = new BigUint64Array(pointer as never, 0, 3);
    const chunks = [raw[0], raw[1], raw[2]] as RawImage;

    return this.unpack(chunks);
  }
}
