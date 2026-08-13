import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { readFileSync } from 'fs';
import { resolve } from 'path';

async function deploy() {
  const account = process.env.DEPLOYER_ACCOUNT as `0x${string}`;
  if (!account) {
    console.error('Set DEPLOYER_ACCOUNT env var to your wallet address');
    process.exit(1);
  }

  const client = createClient({
    chain: studionet,
    account,
  });

  const contractPath = resolve(__dirname, '../contracts/fiducia.py');
  const contractCode = readFileSync(contractPath, 'utf-8');

  console.log('Deploying Fiducia contract to GenLayer Studionet...');

  const tx = await client.deployContract({
    code: contractCode,
    args: [],
  });

  console.log('Transaction hash:', tx);

  const receipt = await client.waitForTransactionReceipt({
    hash: tx,
    status: 'FINALIZED',
  });

  const address = (receipt as any)?.data?.contract_address;
  console.log('\n✅ Fiducia deployed successfully!');
  console.log('Contract address:', address);
  console.log('\nAdd to your .env:');
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

deploy().catch(console.error);
