import log from 'loglevel'

import { errors } from '@/errors'
import { Bus } from '@/helpers'
import i18n from '@/localization'

export class ErrorHandler {
  static process(error: Error | unknown, errorMessage = ''): void {
    const msgTranslation = errorMessage || ErrorHandler._getErrorMessage(error)
    Bus.error(msgTranslation)

    ErrorHandler.processWithoutFeedback(error)
  }

  static processWithoutFeedback(error: Error | unknown): void {
    log.error(error)
  }

  static _getErrorMessage(error: Error | unknown): string {
    let errorMessage = ''

    if (error instanceof Error) {
      switch (error.constructor) {
        case errors.ProviderChainNotFoundError:
          errorMessage = i18n.t('errors.provider-chain-not-found-error')
          break
        case errors.ProviderNotSupportedError:
          errorMessage = i18n.t('errors.provider-not-supported-error')
          break
        case errors.ProviderUserRejectedRequest:
          errorMessage = i18n.t('errors.provider-user-rejected-request')
          break
        case errors.ProviderUnauthorized:
          errorMessage = i18n.t('errors.provider-unauthorized')
          break
        case errors.ProviderUnsupportedMethod:
          errorMessage = i18n.t('errors.provider-unsupported-method')
          break
        case errors.ProviderDisconnected:
          errorMessage = i18n.t('errors.provider-disconnected')
          break
        case errors.ProviderChainDisconnected:
          errorMessage = i18n.t('errors.provider-chain-disconnected')
          break
        case errors.ProviderParseError:
          errorMessage = i18n.t('errors.provider-parse-error')
          break
        case errors.ProviderInvalidRequest:
          errorMessage = i18n.t('errors.provider-invalid-request')
          break
        case errors.ProviderMethodNotFound:
          errorMessage = i18n.t('errors.provider-method-not-found')
          break
        case errors.ProviderInvalidParams:
          errorMessage = i18n.t('errors.provider-invalid-params')
          break
        case errors.ProviderInternalError:
          errorMessage = i18n.t('errors.provider-internal-error')
          break
        case errors.ProviderInvalidInput:
          errorMessage = i18n.t('errors.provider-invalid-input')
          break
        case errors.ProviderResourceNotFound:
          errorMessage = i18n.t('errors.provider-resource-not-found')
          break
        case errors.ProviderResourceUnavailable:
          errorMessage = i18n.t('errors.provider-resource-unavailable')
          break
        case errors.ProviderTransactionRejected:
          errorMessage = i18n.t('errors.provider-transaction-rejected')
          break
        case errors.ProviderMethodNotSupported:
          errorMessage = i18n.t('errors.provider-method-not-supported')
          break
        case errors.ProviderLimitExceeded:
          errorMessage = i18n.t('errors.provider-limit-exceeded')
          break
        case errors.ProviderJsonRpcVersionNotSupported:
          errorMessage = i18n.t(
            'errors.provider-json-rpc-version-not-supported',
          )
          break
        case errors.ProviderWrapperMethodNotFoundError:
          errorMessage = i18n.t('errors.provider-wrapper-method-not-found')
          break
        default: {
          return i18n.t('errors.default')
        }
      }
    }

    return errorMessage
  }
}
