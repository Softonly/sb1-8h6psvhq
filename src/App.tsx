import React, { useState } from 'react';
import { Network, Database, Share2 } from 'lucide-react';
import { LedgerService } from './services/LedgerService';

const ledgerService = new LedgerService();

function App() {
  const [nodeCount, setNodeCount] = useState(0);
  const [cacheCount, setCacheCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [infuraApiKey, setInfuraApiKey] = useState('');
  const [blockNumber, setBlockNumber] = useState<string | null>(null);

  const handleAddNode = async () => {
    try {
      setError(null);
      const demoWallet = '0x10964bf243f3318bfbaa87060cdd5a7fe7a54601';
      const node = await ledgerService.registerNode(demoWallet, infuraApiKey || undefined);
      setNodeCount(prev => prev + 1);
      if (node.blockNumber) {
        setBlockNumber(node.blockNumber);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add node');
    }
  };

  const handleAddCache = async () => {
    try {
      setError(null);
      const demoPrivateKey = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
      const demoWallet = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      
      await ledgerService.addCacheEntry(
        'https://example.com',
        'Demo cached content',
        demoWallet,
        demoPrivateKey
      );
      setCacheCount(prev => prev + 1);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add cache entry');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Web6 Distributed Cache Ledger</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A decentralized caching system utilizing wallet-based authentication and distributed network principles
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 text-red-200 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Network className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Network Nodes</h2>
            </div>
            <p className="text-3xl font-bold mb-4">{nodeCount}</p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Infura API Key"
                value={infuraApiKey}
                onChange={(e) => setInfuraApiKey(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {blockNumber && (
                <div className="text-sm text-gray-400">
                  Latest Block: #{blockNumber}
                </div>
              )}
              <button
                onClick={handleAddNode}
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
              >
                Add Test Node
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Cache Entries</h2>
            </div>
            <p className="text-3xl font-bold mb-4">{cacheCount}</p>
            <button
              onClick={handleAddCache}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
            >
              Add Test Cache
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Share2 className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Network Status</h2>
            </div>
            <p className="text-green-500 font-semibold">Active</p>
            <p className="text-sm text-gray-400 mt-2">
              Sharing enabled • DNS verification active
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">System Architecture</h2>
          <div className="space-y-4 text-gray-300">
            <p>• Wallet-based authentication using SHA-384 for node identification</p>
            <p>• Distributed cache sharing through peer-to-peer network</p>
            <p>• DNS verification for domain ownership</p>
            <p>• Cryptographic signatures for content verification</p>
            <p>• Reputation system for reliable nodes</p>
            <p>• Block number tracking with SHA-512 encryption</p>
            <p>• Local SQLite database for persistent storage</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;