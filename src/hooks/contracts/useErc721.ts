import { useMemo } from 'react'

import { handleEthError } from '@/helpers'
import { Erc721__factory, EthProviderRpcError, UseProvider } from '@/types'

export function useErc721(provider?: UseProvider, address?: string) {
  const contractInstance = useMemo(() => {
    if (!address || !provider?.currentProvider) return undefined

    return Erc721__factory.connect(address, provider.currentProvider)
  }, [address, provider])

  const contractInterface = Erc721__factory.createInterface()

  const getOwner = async (tokenId: string) => {
    if (!contractInstance) throw new Error('No contract instance')

    try {
      return contractInstance.ownerOf(tokenId)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const tokenURI = async (tokenId: string) => {
    if (!contractInstance) throw new Error('No contract instance')

    try {
      return contractInstance.tokenURI(tokenId)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const transfer = async (from: string, to: string, tokenId: string) => {
    if (!provider) return

    try {
      const data = contractInterface.encodeFunctionData('transferFrom', [
        from,
        to,
        tokenId,
      ])

      const receipt = await provider.signAndSendTx({
        to: address,
        data,
      })

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    getOwner,
    tokenURI,
    transfer,
  }
}
