import { ETHEREUM_CHAINS, POLYGON_CHAINS, Q_CHAINS } from '@/enums'
import { Chains } from '@/types'

export const CHAINS: Chains = [
  {
    id: ETHEREUM_CHAINS.ethereum,
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: 'https://endpoints.omniatech.io/v1/eth/mainnet/public',
    blockExplorerUrl: 'https://etherscan.io/',
  },
  {
    id: ETHEREUM_CHAINS.goerli,
    token: 'ETH',
    label: 'Goerli',
    rpcUrl: 'https://ethereum-goerli.publicnode.com',
    blockExplorerUrl: 'https://goerli.etherscan.io/',
  },
  {
    id: ETHEREUM_CHAINS.sepolia,
    token: 'ETH',
    label: 'Sepolia',
    rpcUrl: 'https://endpoints.omniatech.io/v1/eth/sepolia/public',
    blockExplorerUrl: 'https://sepolia.etherscan.io/',
  },
  {
    id: POLYGON_CHAINS.mainnet,
    token: 'MATIC',
    label: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorerUrl: 'https://polygonscan.com/',
  },
  {
    id: POLYGON_CHAINS.mumbai,
    token: 'MATIC',
    label: 'Polygon - Mumbai',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
  },
  {
    id: Q_CHAINS.mainet,
    token: 'Q ',
    label: 'Q Mainnet',
    rpcUrl: 'https://rpc.q.org',
    blockExplorerUrl: 'https://explorer.q.org/',
  },
  {
    id: Q_CHAINS.testnet,
    token: 'Q ',
    label: 'Q Testnet',
    rpcUrl: 'https://rpc.qtestnet.org',
    blockExplorerUrl: 'https://explorer.qtestnet.org/',
  },
]
