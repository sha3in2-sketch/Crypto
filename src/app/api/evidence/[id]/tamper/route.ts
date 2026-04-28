import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const item = db.getById(id);
    
    if (!item) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 });
    }

    // Simulate tampering by reversing a portion of the hash or modifying it
    const tamperedHash = item.hash.substring(0, 10) + 'A1B2C3D4' + item.hash.substring(18);
    
    db.update(id, {
      hash: tamperedHash,
      status: 'Tampered'
    });
    
    return NextResponse.json(db.getById(id));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to tamper evidence' }, { status: 500 });
  }
}
