import { EIP1193, EIP1474, PROVIDERS, PROVIDERS_CHECKS } from '@/enums'
import { errors } from '@/errors'
import { EthProviderRpcError, ProviderInstance } from '@/types'

export function getAppropriateProviderName(
  provider: ProviderInstance,
): PROVIDERS {
  const providerName = Object.entries(PROVIDERS_CHECKS).find(el => {
    const [, value] = el

    return ((<unknown>provider) as { [key in PROVIDERS_CHECKS]: boolean })[
      value
    ]
  })

  return ((providerName && providerName[0]) as PROVIDERS) || PROVIDERS.fallback
}

export function handleEthError(error: EthProviderRpcError) {
  switch (error.code) {
    case EIP1193.userRejectedRequest:
      throw new errors.ProviderUserRejectedRequest()
    case EIP1193.unauthorized:
      throw new errors.ProviderUnauthorized()
    case EIP1193.unsupportedMethod:
      throw new errors.ProviderUnsupportedMethod()
    case EIP1193.disconnected:
      throw new errors.ProviderDisconnected()
    case EIP1193.chainDisconnected:
      throw new errors.ProviderChainDisconnected()
    case EIP1474.parseError:
      throw new errors.ProviderParseError()
    case EIP1474.invalidRequest:
      throw new errors.ProviderInvalidRequest()
    case EIP1474.methodNotFound:
      throw new errors.ProviderMethodNotFound()
    case EIP1474.invalidParams:
      throw new errors.ProviderInvalidParams()
    case EIP1474.internalError:
      throw new errors.ProviderInternalError()
    case EIP1474.invalidInput:
      throw new errors.ProviderInvalidInput()
    case EIP1474.resourceNotFound:
      throw new errors.ProviderResourceNotFound()
    case EIP1474.resourceUnavailable:
      throw new errors.ProviderResourceUnavailable()
    case EIP1474.transactionRejected:
      throw new errors.ProviderTransactionRejected()
    case EIP1474.methodNotSupported:
      throw new errors.ProviderMethodNotSupported()
    case EIP1474.limitExceeded:
      throw new errors.ProviderLimitExceeded()
    case EIP1474.jsonRpcVersionNotSupported:
      throw new errors.ProviderJsonRpcVersionNotSupported()
    default:
      throw error
  }
}

export function getEthExplorerTxUrl(explorerUrl: string, txHash: string) {
  return `${explorerUrl}/tx/${txHash}`
}

export function getEthExplorerAddressUrl(explorerUrl: string, address: string) {
  return `${explorerUrl}/address/${address}`
}
