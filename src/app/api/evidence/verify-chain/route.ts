import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateBlockHash, verifySignature, DEMO_KEYS } from '@/lib/blockchain';

export async function GET() {
  try {
    const items = db.getAll();
    if (items.length === 0) {
      return NextResponse.json({ valid: true, items: [] });
    }

    let chainBrokenAtIndex = -1;
    let expectedPreviousHash = '0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // 1. Verify previous hash link
      if (item.previousHash !== expectedPreviousHash) {
        chainBrokenAtIndex = i;
        break;
      }

      // 2. Verify signature
      const isSigValid = await verifySignature(item.fileHash, item.signature, DEMO_KEYS.publicKey);
      if (!isSigValid) {
        chainBrokenAtIndex = i;
        break;
      }

      // 3. Verify block hash
      const recalculatedHash = await calculateBlockHash(
        item.id,
        item.fileHash,
        item.previousHash,
        item.timestamp,
        item.nonce,
        item.signature
      );
      
      if (recalculatedHash !== item.blockHash) {
        chainBrokenAtIndex = i;
        break;
      }

      expectedPreviousHash = item.blockHash;
    }

    if (chainBrokenAtIndex !== -1) {
      // Mark this and all subsequent items as Chain Broken in the response (we don't persist this for demo purposes, or maybe we do?)
      // Let's persist it to make it visual
      for (let i = chainBrokenAtIndex; i < items.length; i++) {
        db.update(items[i].id, { status: 'Chain Broken' });
      }
      return NextResponse.json({ 
        valid: false, 
        brokenAtIndex: chainBrokenAtIndex,
        items: db.getAll()
      });
    }

    return NextResponse.json({ valid: true, items });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify chain' }, { status: 500 });
  }
}
