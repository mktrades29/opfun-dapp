/**
 * Mock OP_NET deployment function.
 * In production this would connect to window.opnet (OP_WALLET)
 * and broadcast a compiled OP_20 contract to Bitcoin L1.
 */

function randomHex(length) {
  const chars = '0123456789abcdef'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export async function deployToken({ name, ticker, supply }) {
  // Check for OP_WALLET
  if (!window.opnet) {
    console.log('[OPfun] No OP_WALLET detected — using mock deployment')
  }

  // Simulate on-chain transaction delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const txHash = `0x${randomHex(64)}`
  const contractAddress = `bc1q${randomHex(38)}`
  const blockHeight = 840000 + Math.floor(Math.random() * 1000)

  return {
    success: true,
    txHash,
    contractAddress,
    token: { name, ticker, supply },
    blockHeight,
    network: 'OP_NET Regtest',
  }
}
