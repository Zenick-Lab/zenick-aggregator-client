import type { Protocol } from "./types"

// This is mock data for demonstration purposes
// In a real application, you would fetch this data from an API or blockchain
export async function fetchProtocols(): Promise<Protocol[]> {
  // Simulate API call delay - reduced to 500ms for better responsiveness
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Use a stable dataset to prevent UI jumps
  return [
    {
      id: "sui-liquid-staking",
      name: "Sui Liquid Staking",
      icon: "/Space Launch System on Pad.png",
      currentAPR: 4.25,
      tvl: 125000000,
      website: "https://example.com/sui-liquid-staking",
      packageId: "0x1234567890abcdef1234567890abcdef12345678",
      moduleName: "liquid_staking",
      stakeFunctionName: "stake",
      unstakeFunctionName: "unstake",
      minStake: 1,
      lockPeriod: 0,
      description:
        "Liquid staking solution that allows you to stake your SUI while maintaining liquidity. Receive stSUI tokens that represent your staked SUI and can be used in DeFi protocols.",
      features: [
        "No lock-up period",
        "Immediate liquidity via stSUI tokens",
        "Automatic compounding of rewards",
        "Integrated with major Sui DeFi protocols",
      ],
    },
    {
      id: "sui-stake-pool",
      name: "Sui Stake Pool",
      icon: "/three-dimensional-spheres.png",
      currentAPR: 4.15,
      tvl: 98000000,
      website: "https://example.com/sui-stake-pool",
      packageId: "0xabcdef1234567890abcdef1234567890abcdef12",
      moduleName: "stake_pool",
      stakeFunctionName: "deposit",
      unstakeFunctionName: "withdraw",
      minStake: 5,
      lockPeriod: 7,
      description:
        "Community-run staking pool with optimized validator selection for consistent returns. Offers a balance between security and yield.",
      features: [
        "7-day lock period",
        "Validator diversification",
        "Weekly reward distribution",
        "Governance participation",
      ],
    },
    {
      id: "sui-validator-staking",
      name: "Sui Validator Staking",
      icon: "/abstract-symphony.png",
      currentAPR: 4.35,
      tvl: 145000000,
      website: "https://example.com/sui-validator-staking",
      packageId: "0x7890abcdef1234567890abcdef1234567890abcd",
      moduleName: "validator_staking",
      stakeFunctionName: "stake_with_validator",
      unstakeFunctionName: "unstake_from_validator",
      minStake: 10,
      lockPeriod: 14,
      description:
        "Direct staking with Sui validators for maximum security and network participation. Ideal for long-term holders who want to support the network.",
      features: [
        "Direct validator rewards",
        "Network governance voting rights",
        "Higher security guarantees",
        "Support network decentralization",
      ],
    },
    {
      id: "sui-defi-staking",
      name: "Sui DeFi Staking",
      icon: "/safety-data-sheet.png",
      currentAPR: 5.1,
      tvl: 75000000,
      website: "https://example.com/sui-defi-staking",
      packageId: "0xdef1234567890abcdef1234567890abcdef12345",
      moduleName: "defi_staking",
      stakeFunctionName: "provide_liquidity",
      unstakeFunctionName: "remove_liquidity",
      minStake: 2,
      lockPeriod: 3,
      description:
        "Hybrid staking solution that combines traditional staking with DeFi yield strategies for enhanced returns.",
      features: [
        "Higher APR through yield farming",
        "Short 3-day lock period",
        "Diversified yield sources",
        "Auto-optimization of strategies",
      ],
    },
    {
      id: "sui-community-pool",
      name: "Sui Community Pool",
      icon: "/secure-contain-protect.png",
      currentAPR: 3.95,
      tvl: 62000000,
      website: "https://example.com/sui-community-pool",
      packageId: "0x567890abcdef1234567890abcdef1234567890ab",
      moduleName: "community_pool",
      stakeFunctionName: "join_pool",
      unstakeFunctionName: "exit_pool",
      minStake: 1,
      lockPeriod: 1,
      description:
        "Community-governed staking pool focused on accessibility and education. Lower returns but extremely user-friendly with minimal lock period.",
      features: [
        "Only 1-day lock period",
        "Low minimum stake (1 SUI)",
        "Educational resources",
        "Community governance",
      ],
    },
    {
      id: "sui-yield-farming",
      name: "Sui Yield Farming",
      icon: "/abstract-geometric-synergy.png",
      currentAPR: 6.2,
      tvl: 42000000,
      website: "https://example.com/sui-yield-farming",
      packageId: "0x90abcdef1234567890abcdef1234567890abcdef",
      moduleName: "yield_farming",
      stakeFunctionName: "farm",
      unstakeFunctionName: "harvest",
      minStake: 5,
      lockPeriod: 30,
      description:
        "Advanced yield farming protocol with the highest APR but also higher risk and longer lock period. For experienced DeFi users.",
      features: [
        "Highest APR available",
        "Multiple reward tokens",
        "Leveraged staking options",
        "Protocol fee sharing",
      ],
    },
  ]
}
