import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import { useConnectWallet, useSetChain } from '@web3-onboard/react'
import { ethers } from 'ethers'
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { config } from '@/config'
import {
  Bus,
  getAppropriateProviderName,
  getEthExplorerAddressUrl,
  getEthExplorerTxUrl,
  getJsonRpcProvider,
  handleEthError,
  hexToNumber,
  numberToHex,
} from '@/helpers'
import {
  EthProviderRpcError,
  EthTransactionResponse,
  TransactionResponse,
  TxRequestBody,
} from '@/types'

type RawProvider =
  | ethers.providers.Web3Provider
  | ethers.providers.JsonRpcProvider

export const useProvider = () => {
  const [{ wallet, connecting }, connectWallet, disconnectWallet] =
    useConnectWallet()

  const [{ connectedChain, settingChain }, setChain] = useSetChain()

  const [chainId, setChainId] = useState<string>('')
  const [selectedAddress, setSelectedAddress] = useState('')

  const [currentProvider, setCurrentProvider] = useState<RawProvider>()
  const [fallbackProvider, setFallbackProvider] = useState<RawProvider>()

  const isFallbackProvider = useMemo(
    () =>
      fallbackProvider &&
      currentProvider &&
      isEqual(fallbackProvider, currentProvider),
    [fallbackProvider, currentProvider],
  )

  const currentSigner = useMemo(
    () => currentProvider && currentProvider.getSigner(),
    [currentProvider],
  )

  const selectedProvider = useMemo(
    () => wallet?.provider && getAppropriateProviderName(wallet.provider),
    [wallet?.provider],
  )

  const isConnected = useMemo(
    () => Boolean(chainId && selectedAddress && selectedProvider),
    [chainId, selectedAddress, selectedProvider],
  )

  const isPerformingOperation = useMemo(
    () => connecting || settingChain,
    [connecting, settingChain],
  )

  const init = (provider: RawProvider) => {
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
        chainId: numberToHex(parseInt(chainId)),
      })
    },
    [setChain, isConnected],
  )

  const signAndSendTx = useCallback(
    async (txRequestBody: TxRequestBody) => {
      if (!currentSigner) return

      try {
        Bus.emit(Bus.eventList.beforeTxSent, { txBody: txRequestBody })

        const transactionResponse = await currentSigner.sendTransaction(
          txRequestBody as Deferrable<TransactionRequest>,
        )

        Bus.emit(Bus.eventList.txSent, { txHash: transactionResponse.hash })

        const receipt = await transactionResponse.wait()

        Bus.emit(Bus.eventList.txConfirmed, { txReceipt: receipt })

        return receipt
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
    const initProvider = async () => {
      let ethersProvider: RawProvider | undefined

      if (
        !wallet?.provider ||
        hexToNumber(chainId) !== parseInt(config.CHAIN_ID)
      ) {
        ethersProvider = fallbackProvider
      } else {
        ethersProvider = new ethers.providers.Web3Provider(
          wallet.provider,
          'any',
        )
      }

      if (!ethersProvider) return

      init(ethersProvider)
    }

    initProvider()
  }, [wallet?.provider, chainId, fallbackProvider])

  useEffect(() => {
    setSelectedAddress(wallet?.accounts[0] ? wallet?.accounts[0].address : '')
  }, [wallet?.accounts])

  useEffect(() => {
    setChainId(connectedChain?.id ?? '')
  }, [connectedChain])

  useEffectOnce(() => {
    const initFallback = async () => {
      const provider = await getJsonRpcProvider(config.CHAIN_ID)

      setFallbackProvider(provider)
    }

    initFallback()
  })

  return {
    currentProvider,

    isFallbackProvider,

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
