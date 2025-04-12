declare global {
  interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
  }

  interface Headers {
    entries(): IterableIterator<[string, string]>;
  }
}

export {};
