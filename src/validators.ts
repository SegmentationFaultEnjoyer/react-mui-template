import { ethers } from 'ethers'
import { isBoolean, isDate, isEmpty, isNumber } from 'lodash-es'

import { Validator } from '@/hooks'
import i18n from '@/localization'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidatorFunc = (...params: any[]) => Validator

const NameRegex = new RegExp(/^[ A-Za-z0-9_.,-=+!?"'“”/]*$/)
const EmaiRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)

export const required: Validator = value => ({
  isValid:
    !isEmpty(value) ||
    isNumber(value) ||
    isDate(value) ||
    isBoolean(value) ||
    value instanceof File,
  message: i18n.t('validations.field-error_required'),
})

export const alphaNumWithSpecialChars: Validator = value => ({
  isValid: NameRegex.test(value),
  message: i18n.t('validations.field-error_alphaNumWithSpecialChars'),
})

export const email: Validator = value => ({
  isValid: EmaiRegex.test(value),
  message: i18n.t('validations.field-error_email'),
})

export const address: Validator = value => ({
  isValid: !value ? true : ethers.utils.isAddress(value),
  message: i18n.t('validations.field-error_address'),
})

export const minValue: ValidatorFunc = (minValue: number) => value => ({
  isValid: Number(value) >= minValue,
  message: i18n.t('validations.field-error_minValue', {
    minValue,
  }),
})

export const maxValue: ValidatorFunc = (maxValue: number) => value => ({
  isValid: Number(value) <= maxValue,
  message: i18n.t('validations.field-error_maxValue', {
    maxValue,
  }),
})

export const minLength: ValidatorFunc = (length: number) => value => ({
  isValid: String(value).length >= length,
  message: i18n.t('validations.field-error_minLength', {
    minLength: length,
  }),
})

export const maxLength: ValidatorFunc = (length: number) => value => ({
  isValid: String(value).length <= length,
  message: i18n.t('validations.field-error_maxLength', {
    maxLength: length,
  }),
})
