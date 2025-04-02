import type { DecryptFileOptions, EncryptFileOptions } from './types';
import {
  getAesKey,
  getDecryptedData,
  getEncryptedData,
  getEncryptionIv,
} from './utilities';

export async function encryptFile(options: EncryptFileOptions) {
  const [data, key] = await Promise.all([
    Bun.file(options.input).arrayBuffer(),
    getAesKey(options),
  ]);

  const iv = getEncryptionIv();

  const encrypted = await getEncryptedData({
    data,
    key,
    iv,
  });

  await Bun.write(options.output, Buffer.concat([iv, Buffer.from(encrypted)]));
}

export async function decryptFile(options: DecryptFileOptions) {
  const [fullData, key] = await Promise.all([
    Bun.file(options.input).arrayBuffer(),
    getAesKey(options),
  ]);

  const iv = fullData.slice(0, 12);
  const encrypted = fullData.slice(12);

  const decrypted = await getDecryptedData({
    data: encrypted,
    key,
    iv,
  });

  await Bun.write(options.output, new Uint8Array(decrypted));
}
