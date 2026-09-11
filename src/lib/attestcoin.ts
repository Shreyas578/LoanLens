import { JsonRpcProvider } from 'ethers';
import { chainInfo, blockProver, proofProvider } from '@gluwa/usc-sdk';

const CREDITCOIN_RPC_URL = process.env.CREDITCOIN_RPC_URL || 'https://rpc.cc3-testnet.creditcoin.network';
const PROVER_URL = 'https://prover.cc3-testnet.creditcoin.network';
// Using Ethereum Sepolia as the default source chain for the testnet integration
const SOURCE_CHAIN_RPC_URL = process.env.SOURCE_CHAIN_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';

/**
 * Validates a transaction using the Attestcoin (USC) SDK.
 * @param txHash The transaction hash on the source chain (e.g. Sepolia)
 * @returns boolean indicating whether the attestation and verification were successful
 */
export async function attestTransaction(txHash: string): Promise<boolean> {
  try {
    // Resolve chain key (1 = Ethereum Sepolia)
    const chainKey = 1;

    // Initialize Providers
    const sourceProvider = new JsonRpcProvider(SOURCE_CHAIN_RPC_URL);
    const creditcoinProvider = new JsonRpcProvider(CREDITCOIN_RPC_URL);
    
    // Initialize SDK components
    const prover = new blockProver.PrecompileBlockProver(creditcoinProvider);
    const proofBuilder = new proofProvider.service.ProofBuilder(
      chainKey,
      PROVER_URL,
    );

    // 1. Find block and wait for attestation
    console.log(`[Attestcoin] Fetching tx ${txHash} on source chain...`);
    const tx = await sourceProvider.getTransaction(txHash);
    
    if (!tx || !tx.blockNumber) {
        throw new Error("Transaction not found or not yet mined.");
    }

    console.log(`[Attestcoin] Waiting for Creditcoin to attest block ${tx.blockNumber}...`);
    // Note: In a real frontend demo, we might want to poll this status rather than block the UI completely.
    await proofBuilder.waitUntilHeightAttested(chainKey, tx.blockNumber);
    console.log(`[Attestcoin] Block ${tx.blockNumber} attested.`);

    // 2. Generate proof via API
    console.log(`[Attestcoin] Generating proof for ${txHash}...`);
    const result = await proofBuilder.getProof(txHash);
    
    if (!result.success || !result.data) {
      throw new Error(`Proof generation failed: ${result.error}`);
    }

    const { chainKey: ck, headerNumber, txBytes, merkleProof, continuityProof } = result.data;

    // 3. Verify on-chain (Creditcoin Testnet)
    console.log(`[Attestcoin] Verifying proof on Creditcoin...`);
    const verified = await prover.verifySingle(ck, headerNumber, txBytes, merkleProof, continuityProof);
    
    console.log('[Attestcoin] Proof verification:', verified ? 'SUCCESS' : 'FAILED');
    return verified;
  } catch (error) {
    console.error("[Attestcoin] Attestation error:", error);
    return false;
  }
}
