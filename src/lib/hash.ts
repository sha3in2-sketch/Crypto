import { createWhirlpool } from 'hash-wasm';

export async function calculateWhirlpoolHash(input: string | Uint8Array | File): Promise<string> {
  const hasher = await createWhirlpool();
  hasher.init();

  if (typeof input === 'string') {
    hasher.update(input);
  } else if (input instanceof Uint8Array) {
    hasher.update(input);
  } else if (input instanceof File) {
    // For files, we read them in chunks if they are large, but for demo we can read array buffer
    const arrayBuffer = await input.arrayBuffer();
    hasher.update(new Uint8Array(arrayBuffer));
  }

  return hasher.digest('hex');
}

export function hexToBinary(hex: string): string {
  let binary = '';
  for (let i = 0; i < hex.length; i++) {
    const bin = parseInt(hex[i], 16).toString(2).padStart(4, '0');
    binary += bin;
  }
  return binary;
}
