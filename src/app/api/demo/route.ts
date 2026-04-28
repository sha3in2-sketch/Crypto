import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateEvidenceId } from '@/lib/utils';
import { calculateWhirlpoolHash } from '@/lib/hash';

export async function POST() {
  try {
    db.clear();
    
    // Create demo items
    const demoItems = [
      { name: 'CCTV_Footage_Main_Gate.mp4', size: 10485760 },
      { name: 'Crime_Scene_Photo_01.jpg', size: 2048576 },
      { name: 'Witness_Statement_JohnD.pdf', size: 512000 },
      { name: 'Suspect_Phone_Backup.zip', size: 52428800 }
    ];

    for (const item of demoItems) {
      const hash = await calculateWhirlpoolHash(`demo_content_${item.name}_${Date.now()}`);
      db.save({
        id: generateEvidenceId(),
        fileName: item.name,
        fileSize: item.size,
        hash,
        timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        status: 'Secure'
      });
    }

    // Add one tampered item
    const tamperedItem = demoItems[0];
    const tamperedHash = await calculateWhirlpoolHash(`tampered_content`);
    db.save({
      id: generateEvidenceId(),
      fileName: 'CONFIDENTIAL_Financial_Records.xlsx',
      fileSize: 1548200,
      hash: tamperedHash,
      timestamp: new Date(Date.now() - 500000000).toISOString(),
      status: 'Tampered'
    });

    return NextResponse.json({ message: 'Demo data populated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to populate demo data' }, { status: 500 });
  }
}
