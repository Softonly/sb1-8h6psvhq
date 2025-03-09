import { ethers } from 'ethers';
import { CacheEntry, DnsVerification, LedgerNode, BlockInfo } from '../types/ledger';
import { generateNodeId, signContent, verifySignature, generateBlockHash } from '../utils/crypto';

let createClient: any;
if (typeof window === 'undefined') {
  createClient = (await import('@libsql/client')).createClient;
}

export class LedgerService {
  private nodes: Map<string, LedgerNode>;
  private cacheEntries: Map<string, CacheEntry>;
  private dnsVerifications: Map<string, DnsVerification>;
  private provider: ethers.JsonRpcProvider | null = null;

  constructor() {
    this.nodes = new Map();
    this.cacheEntries = new Map();
    this.dnsVerifications = new Map();
  }

  private async storeBlockInfo(nodeId: string, blockInfo: BlockInfo): Promise<void> {
    try {
      if (!createClient) return;

      const db = createClient({ url: 'file:ledger.db' });

      await db.execute(`
        CREATE TABLE IF NOT EXISTS block_info (
          node_id TEXT PRIMARY KEY,
          block_number TEXT NOT NULL,
          block_hash TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          encrypted_hash TEXT NOT NULL
        )
      `);

      const encryptedHash = await generateBlockHash(blockInfo.hash);

      await db.execute({
        sql: `
          INSERT OR REPLACE INTO block_info (node_id, block_number, block_hash, timestamp, encrypted_hash)
          VALUES (?, ?, ?, ?, ?)
        `,
        args: [nodeId, blockInfo.number, blockInfo.hash, blockInfo.timestamp, encryptedHash]
      });
    } catch (error) {
      console.error('Error storing block info:', error);
      throw new Error('Failed to store block information');
    }
  }
}
