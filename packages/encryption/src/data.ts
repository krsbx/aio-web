import type { DecryptDataOptions, EncryptDataOptions } from './types';
import {
  getAesKey,
  getDecryptedData,
  getEncryptedData,
  getEncryptionIv,
} from './utilities';

export async function encryptData(options: EncryptDataOptions) {
  const key = await getAesKey(options);
  const iv = getEncryptionIv();

  const data = new TextEncoder().encode(options.data);

  const encrypted = await getEncryptedData({
    data,
    key,
    iv,
  });

  return {
    iv: Buffer.from(iv).toString('base64'),
    data: Buffer.from(encrypted).toString('base64'),
  };
}

export async function decryptData(options: DecryptDataOptions) {
  const key = await getAesKey(options);
  const iv = Uint8Array.from(Buffer.from(options.iv, 'base64'));
  const data = Buffer.from(options.data, 'base64');

  const decrypted = await getDecryptedData({
    data,
    key,
    iv,
  });

  return new TextDecoder().decode(decrypted);
}
