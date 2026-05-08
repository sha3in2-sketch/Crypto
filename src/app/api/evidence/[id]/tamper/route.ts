import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const item = db.getById(id);
    
    if (!item) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch(e) {}
    
    const attackType = body.attackType || 'content'; // 'content' | 'block' | 'signature'

    let updates: any = { status: 'Tampered' };

    if (attackType === 'content') {
      // Modify file content (which changes the hash in reality, here we mock it by changing fileHash and content)
      updates.fileHash = item.fileHash.substring(0, 10) + 'A1B2C3D4' + item.fileHash.substring(18);
      updates.content = item.content + ' [TAMPERED]';
    } else if (attackType === 'block') {
      // Modify the block hash directly (simulates block tampering)
      updates.blockHash = item.blockHash.substring(0, 5) + 'DEADBEEF' + item.blockHash.substring(13);
    } else if (attackType === 'signature') {
      // Fake the signature
      updates.signature = 'SIG-FAKE1234567890';
      updates.signer = 'Hacker';
    } else {
      // Default fallback
      updates.fileHash = item.fileHash.substring(0, 10) + 'A1B2C3D4' + item.fileHash.substring(18);
    }
    
    db.update(id, updates);
    
    return NextResponse.json(db.getById(id));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to tamper evidence' }, { status: 500 });
  }
}
