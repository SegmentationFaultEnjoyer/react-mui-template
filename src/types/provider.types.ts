import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Deferrable } from '@ethersproject/properties'
import {
  Transaction as SolTransaction,
  TransactionSignature,
} from '@solana/web3.js'
import { ethers } from 'ethers'

import { PROVIDERS } from '@/enums'
import { useProvider } from '@/hooks'
import { EthereumProvider, PhantomProvider } from '@/types'

/**
 * Non defined provider from browser
 */
export type ProviderInstance = EthereumProvider | PhantomProvider | unknown

/**
 * provider, which we've designated, it has a name and instance
 */
export type DesignatedProvider = {
  name: PROVIDERS
  instance: ProviderInstance
}

export type ChainId = string | number

export type Chain = {
  id: ChainId
  name: string
  rpcUrl: string
}

export type TxRequestBody =
  | Deferrable<TransactionRequest>
  | SolTransaction
  | string
  | unknown

export type EthTransactionResponse = ethers.providers.TransactionReceipt

export type SolanaTransactionResponse = TransactionSignature

export type TransactionResponse =
  | EthTransactionResponse
  | SolanaTransactionResponse
  | unknown

export type UseProvider = ReturnType<typeof useProvider>
