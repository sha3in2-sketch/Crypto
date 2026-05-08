import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { EvidenceItem } from '@/lib/db';
import { calculateBlockHash, signData, DEMO_KEYS } from '@/lib/blockchain';

export async function GET() {
  const items = db.getAll();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const items = db.getAll();
    const previousHash = items.length > 0 ? items[items.length - 1].blockHash : '0000000000000000000000000000000000000000000000000000000000000000';
    
    const timestamp = new Date().toISOString();
    const nonce = Math.floor(Math.random() * 1000000);
    const signer = 'Investigator Admin';
    const signature = await signData(data.fileHash, DEMO_KEYS.privateKey);
    const blockHash = await calculateBlockHash(data.id, data.fileHash, previousHash, timestamp, nonce, signature);

    const newItem: EvidenceItem = {
      ...data,
      blockHash,
      previousHash,
      timestamp,
      nonce,
      signature,
      signer,
      status: 'Secure'
    };
    
    db.save(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save evidence' }, { status: 500 });
  }
}
