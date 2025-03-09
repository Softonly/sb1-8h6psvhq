import { ethers } from 'ethers';

export const generateNodeId = async (walletAddress: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(walletAddress);
    const hashBuffer = await crypto.subtle.digest('SHA-384', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.slice(-8);
  } catch (error) {
    console.error('Error generating node ID:', error);
    throw new Error('Failed to generate node ID');
  }
};

export const generateBlockHash = async (blockHash: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(blockHash);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error generating block hash:', error);
    throw new Error('Failed to generate block hash');
  }
};

export const signContent = async (content: string, privateKey: string): Promise<string> => {
  try {
    if (!ethers.isHexString(privateKey)) {
      throw new Error('Invalid private key format');
    }
    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet.signMessage(content);
    return signature;
  } catch (error) {
    console.error('Error signing content:', error);
    throw new Error('Failed to sign content');
  }
};

export const verifySignature = (content: string, signature: string, walletAddress: string): boolean => {
  try {
    if (!ethers.isHexString(signature)) {
      throw new Error('Invalid signature format');
    }
    if (!ethers.isAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }
    const recoveredAddress = ethers.verifyMessage(content, signature);
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};