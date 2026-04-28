import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    db.clear();
    return NextResponse.json({ message: 'Evidence locker cleared successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear evidence locker' }, { status: 500 });
  }
}
