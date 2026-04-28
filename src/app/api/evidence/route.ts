import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { EvidenceItem } from '@/lib/db';

export async function GET() {
  const items = db.getAll();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newItem: EvidenceItem = {
      ...data,
      timestamp: new Date().toISOString(),
      status: 'Secure'
    };
    
    db.save(newItem);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save evidence' }, { status: 500 });
  }
}
