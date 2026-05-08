import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateEvidenceId } from '@/lib/utils';
import { calculateWhirlpoolHash } from '@/lib/hash';
import { calculateBlockHash, signData, DEMO_KEYS } from '@/lib/blockchain';

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

    let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';

    for (const item of demoItems) {
      const content = `demo_content_${item.name}_${Date.now()}`;
      const fileHash = await calculateWhirlpoolHash(content);
      const id = generateEvidenceId();
      const nonce = Math.floor(Math.random() * 1000000);
      const timestamp = new Date(Date.now() - Math.random() * 10000000000).toISOString();
      const signer = 'Inspector Gadget';
      const signature = await signData(fileHash, DEMO_KEYS.privateKey);
      const blockHash = await calculateBlockHash(id, fileHash, previousHash, timestamp, nonce, signature);

      db.save({
        id,
        fileName: item.name,
        fileSize: item.size,
        fileHash,
        blockHash,
        previousHash,
        timestamp,
        status: 'Secure',
        nonce,
        signature,
        signer,
        content
      });

      previousHash = blockHash;
    }

    // Add one tampered item
    const tamperedContent = `tampered_content`;
    const tamperedFileHash = await calculateWhirlpoolHash(tamperedContent);
    const tamperedId = generateEvidenceId();
    const tNonce = Math.floor(Math.random() * 1000000);
    const tTimestamp = new Date(Date.now() - 500000000).toISOString();
    const tSigner = 'Inspector Gadget';
    const tSignature = await signData(tamperedFileHash, DEMO_KEYS.privateKey);
    const tBlockHash = await calculateBlockHash(tamperedId, tamperedFileHash, previousHash, tTimestamp, tNonce, tSignature);

    db.save({
      id: tamperedId,
      fileName: 'CONFIDENTIAL_Financial_Records.xlsx',
      fileSize: 1548200,
      fileHash: tamperedFileHash, // It's tampered, so maybe the content doesn't match the original, but since it's the last one, it's just marked Tampered. Let's make it more realistic by changing the fileHash to simulate tampering.
      blockHash: tBlockHash,
      previousHash: previousHash,
      timestamp: tTimestamp,
      status: 'Tampered',
      nonce: tNonce,
      signature: tSignature,
      signer: tSigner,
      content: tamperedContent
    });

    return NextResponse.json({ message: 'Demo data populated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to populate demo data' }, { status: 500 });
  }
}
