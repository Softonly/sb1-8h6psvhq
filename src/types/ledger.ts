export interface CacheEntry {
  url: string;
  content: string;
  timestamp: number;
  signature: string;
  provider: string;
  walletAddress: string;
}

export interface DnsVerification {
  domain: string;
  verified: boolean;
  timestamp: number;
  signature: string;
}

export interface LedgerNode {
  id: string;
  walletAddress: string;
  lastSeen: number;
  cacheEntries: string[];
  reputation: number;
  blockNumber?: string;
  infuraApiKey?: string;
}

export interface BlockInfo {
  number: string;
  hash: string;
  timestamp: number;
}