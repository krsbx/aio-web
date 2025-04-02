import type {
  AesKeyOptions,
  GenerateDecryptedOptions,
  GenerateEncryptedOptions,
} from './types';

export async function getFileChecksum(filePath: string): Promise<string> {
  const data = await Bun.file(filePath).arrayBuffer();
  const hash = await crypto.subtle.digest('SHA-256', data);

  return Buffer.from(hash).toString('hex');
}

export function getEncryptionIv() {
  return crypto.getRandomValues(new Uint8Array(12));
}

export async function getEncryptedData(options: GenerateEncryptedOptions) {
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: options.iv },
    options.key,
    options.data
  );

  return encrypted;
}

export async function getDecryptedData(options: GenerateDecryptedOptions) {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: options.iv },
    options.key,
    options.data
  );

  return decrypted;
}

export async function getAesKey(options: AesKeyOptions) {
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(options.password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  let salt: Uint8Array = new Uint8Array([]);

  if (options.salt) {
    if (typeof options.salt === 'string') {
      salt = new TextEncoder().encode(options.salt);
    } else if (options.salt instanceof Uint8Array) {
      salt = options.salt;
    }
  }

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
