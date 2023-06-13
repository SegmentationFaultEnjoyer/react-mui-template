import { useMemo, useState } from 'react'

import { handleEthError } from '@/helpers'
import { Erc721__factory, EthProviderRpcError, UseProvider } from '@/types'

export function useErc721(provider?: UseProvider, address?: string) {
  const [contractAddress, setContractAddress] = useState(address)

  const contractInstance = useMemo(
    () =>
      (!!provider &&
        !!provider.currentProvider &&
        !!contractAddress &&
        Erc721__factory.connect(contractAddress, provider.currentProvider)) ||
      undefined,
    [contractAddress, provider],
  )
  const contractInterface = Erc721__factory.createInterface()

  const isInitialized = useMemo(
    () => Boolean(contractInstance) && Boolean(contractAddress),
    [contractAddress, contractInstance],
  )

  const init = (address: string) => {
    if (!address) return

    setContractAddress(address)
  }

  const getOwner = async (tokenId: string) => {
    if (!contractInstance) return

    try {
      return contractInstance.ownerOf(tokenId)
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  const tokenURI = async (tokenId: string) => {
    if (!contractInstance) return

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
        to: contractAddress,
        data,
      })

      return receipt
    } catch (error) {
      handleEthError(error as EthProviderRpcError)
    }
  }

  return {
    isInitialized,

    init,
    getOwner,
    tokenURI,
    transfer,
  }
}
