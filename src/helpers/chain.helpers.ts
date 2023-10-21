import { providers } from 'ethers'

import { hexToNumber } from '@/helpers'

const CHAIN_LIST_LINK = 'https://chainid.network/chains_mini.json'

type ChainInfo = {
  name: string
  chainId: number
  shortName: string
  networkId: number
  rpc: string[]
}

export const getChainRpcLink = async (chainId: string) => {
  const chainList: ChainInfo[] = await (await fetch(CHAIN_LIST_LINK)).json()

  if (!chainList || !chainList.length)
    throw new Error(`Failed to fetch chain list from ${CHAIN_LIST_LINK}`)

  const chain = hexToNumber(chainId)

  const chainInfo = chainList.find(el => el.chainId === chain)

  if (!chainInfo) throw new Error(`Failed to find chain with chain id ${chain}`)

  // picking RPC that doesn't require api keys
  const rpcUrl = chainInfo.rpc.find(
    rpc => !rpc.includes('API_KEY') && rpc.startsWith('http'),
  )

  if (!rpcUrl) throw new Error(`Failed to find rpc url for chain id ${chain}`)

  return rpcUrl
}

export const getJsonRpcProvider = async (
  chainId: string,
): Promise<providers.JsonRpcProvider> => {
  const rpcUrl = await getChainRpcLink(chainId)

  return new providers.JsonRpcProvider(rpcUrl, 'any')
}
