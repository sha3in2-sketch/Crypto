import { calculateWhirlpoolHash } from './hash';
import { EvidenceItem } from './db';

// Simple mock for public/private key pairs and signatures
export const generateKeys = () => {
  return {
    publicKey: 'PUB-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    privateKey: 'PRIV-' + Math.random().toString(36).substring(2, 10).toUpperCase()
  };
};

export const DEMO_KEYS = {
  publicKey: 'PUB-INSPECTOR-1',
  privateKey: 'PRIV-INSPECTOR-1'
};

// Simplified mock signature
export const signData = async (data: string, privateKey: string) => {
  // We use whirlpool for the signature just for simplicity
  const sig = await calculateWhirlpoolHash(data + privateKey);
  return 'SIG-' + sig.substring(0, 16).toUpperCase();
};

export const verifySignature = async (data: string, signature: string, publicKey: string) => {
  // In a real system, we'd use RSA/ECDSA and the public key. Here we just mock it using our known demo key.
  const expectedSig = await signData(data, DEMO_KEYS.privateKey);
  return signature === expectedSig;
};

// Block hashing
export const calculateBlockHash = async (
  id: string,
  fileHash: string,
  previousHash: string,
  timestamp: string,
  nonce: number,
  signature: string
) => {
  const blockData = `${id}${fileHash}${previousHash}${timestamp}${nonce}${signature}`;
  const hash = await calculateWhirlpoolHash(blockData);
  return hash;
};

// Merkle Tree implementation (Advanced Layer)
export const buildMerkleTree = async (hashes: string[]): Promise<string[]> => {
  if (hashes.length === 0) return [];
  if (hashes.length === 1) return hashes;

  const nextLevel: string[] = [];
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i];
    const right = i + 1 < hashes.length ? hashes[i + 1] : left; // duplicate if odd
    const combined = await calculateWhirlpoolHash(left + right);
    nextLevel.push(combined);
  }
  return buildMerkleTree(nextLevel);
};

export const getMerkleRoot = async (items: EvidenceItem[]): Promise<string> => {
  const hashes = items.map(i => i.blockHash);
  const tree = await buildMerkleTree(hashes);
  return tree[0] || '';
};
