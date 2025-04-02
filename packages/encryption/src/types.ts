export interface AesKeyOptions {
  password: string;
  salt?: string | Uint8Array | null;
}

export interface EncryptFileOptions extends AesKeyOptions {
  input: string;
  output: string;
}

export interface DecryptFileOptions extends AesKeyOptions {
  input: string;
  output: string;
}

export interface EncryptDataOptions extends AesKeyOptions {
  data: string;
}

export interface DecryptDataOptions extends AesKeyOptions {
  data: string;
  iv: string;
}

export interface GenerateEncryptedOptions {
  iv: Uint8Array | ArrayBuffer;
  key: CryptoKey;
  data: Uint8Array | ArrayBuffer;
}

export interface GenerateDecryptedOptions {
  iv: Uint8Array | ArrayBuffer;
  key: CryptoKey;
  data: Uint8Array | ArrayBuffer;
}
