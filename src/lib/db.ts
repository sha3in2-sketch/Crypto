import fs from 'fs';
import path from 'path';

export interface EvidenceItem {
  id: string;
  fileName: string;
  fileSize: number;
  hash: string;
  timestamp: string;
  status: 'Secure' | 'Tampered';
}

const dataFilePath = path.join(process.cwd(), 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

export const db = {
  getAll: (): EvidenceItem[] => {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },
  
  save: (item: EvidenceItem): void => {
    const items = db.getAll();
    items.push(item);
    fs.writeFileSync(dataFilePath, JSON.stringify(items, null, 2));
  },
  
  update: (id: string, updates: Partial<EvidenceItem>): void => {
    const items = db.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      fs.writeFileSync(dataFilePath, JSON.stringify(items, null, 2));
    }
  },
  
  getById: (id: string): EvidenceItem | undefined => {
    return db.getAll().find(i => i.id === id);
  },

  clear: (): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
  }
};
