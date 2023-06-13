import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import { ethers } from 'ethers'
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  getAppropriateProviderName,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  handleEthError,
} from '@/helpers'
import {
  EthProviderRpcError,
  EthTransactionResponse,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

export interface UseProvider {
  currentProvider?: ethers.providers.Web3Provider

  init: (provider: ethers.providers.Web3Provider) => Promise<void>
  disconnect: () => void
  chainId: string
  selectedAddress: string
  selectedProvider: string | undefined
  switchChain: (chainId: string) => Promise<void>
  signAndSendTx: (txRequestBody: TxRequestBody) => Promise<TransactionResponse>
  isConnected: boolean
  isPerformingOperation: boolean
  connect: () => Promise<void>
  getHashFromTxResponse: (txResponse: TransactionResponse) => string
  getTxUrl: (explorerUrl: string, txHash: string) => string
  getAddressUrl: (explorerUrl: string, address: string) => string
  signMessage: (message: string) => Promise<string | undefined>
}

export const useProvider = (): UseProvider => {
  const [{ wallet, connecting }, connectWallet, disconnectWallet] =
    useConnectWallet()

  const [{ connectedChain, settingChain }, setChain] = useSetChain()

  const [chainId, setChainId] = useState<string>('')
  const [selectedAddress, setSelectedAddress] = useState('')

  const [currentProvider, setCurrentProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >()

  const currentSigner = useMemo(
    () => currentProvider && currentProvider.getSigner(),
    [currentProvider],
  )

  const selectedProvider = useMemo(
    () => wallet?.provider && getAppropriateProviderName(wallet.provider),
    [wallet?.provider],
  )

  const isConnected = useMemo(
    () => Boolean(chainId && selectedAddress),
    [chainId, selectedAddress],
  )

  const isPerformingOperation = useMemo(
    () => connecting || settingChain,
    [connecting, settingChain],
  )

  const init = async (provider: ethers.providers.Web3Provider) => {
    setCurrentProvider(oldProvider => {
      return isEqual(oldProvider, provider) ? oldProvider : provider
    })
  }

  const connect = useCallback(async () => {
    connectWallet()
  }, [connectWallet])

  const disconnect = useCallback(() => {
    if (!wallet) return

    disconnectWallet({
      label: wallet.label,
    })
    setChainId('')
    setSelectedAddress('')
    setCurrentProvider(undefined)
  }, [wallet, disconnectWallet])

  const switchChain = useCallback(
    async (chainId: string) => {
      if (!isConnected) return

      setChain({
        chainId,
      })
    },
    [setChain, isConnected],
  )

  const signAndSendTx = useCallback(
    async (txRequestBody: TxRequestBody) => {
      if (!currentSigner) return

      try {
        const transactionResponse = await currentSigner.sendTransaction(
          txRequestBody as Deferrable<TransactionRequest>,
        )

        return transactionResponse.wait()
      } catch (error) {
        handleEthError(error as EthProviderRpcError)
      }
    },
    [currentSigner],
  )

  const signMessage = useCallback(
    async (message: string) => {
      if (!currentSigner) return

      try {
        const msg = await currentSigner.signMessage(message)
        return msg
      } catch (error) {
        handleEthError(error as EthProviderRpcError)
      }
    },
    [currentSigner],
  )

  const getHashFromTxResponse = (txResponse: TransactionResponse) => {
    const transactionResponse = txResponse as EthTransactionResponse

    return transactionResponse.transactionHash
  }

  const getTxUrl = (explorerUrl: string, txHash: string) => {
    return getEthExplorerTxUrl(explorerUrl, txHash)
  }

  const getAddressUrl = (explorerUrl: string, address: string) => {
    return getEthExplorerAddressUrl(explorerUrl, address)
  }

  useEffect(() => {
    if (!wallet?.provider) return

    const ethersProvider = new ethers.providers.Web3Provider(
      wallet.provider,
      'any',
    )

    init(ethersProvider)
  }, [wallet?.provider])

  useEffect(() => {
    if (!wallet?.accounts[0]) return

    setSelectedAddress(wallet.accounts[0].address)
  }, [wallet?.accounts])

  useEffect(() => {
    if (!connectedChain?.id) return

    setChainId(connectedChain.id)
  }, [connectedChain])

  return {
    currentProvider,

    chainId,
    selectedAddress,
    selectedProvider,
    isConnected,
    isPerformingOperation,

    init,
    connect,
    disconnect,
    switchChain,
    signAndSendTx,
    signMessage,
    getHashFromTxResponse,
    getTxUrl,
    getAddressUrl,
  }
}
