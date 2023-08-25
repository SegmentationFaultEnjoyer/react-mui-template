import './styles.scss'

import { DeleteForever } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import { FC, useCallback, useEffect, useState } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { Bus, ErrorHandler } from '@/helpers'
import { useErc721, useForm, useFormValidation, useProvider } from '@/hooks'
import { address as addressValidator, required } from '@/validators'

const Erc721Test: FC = () => {
  const provider = useProvider()

  const erc721 = useErc721(provider)

  const [address, setAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [isFetchingTokenInfo, setIsFetchingTokenInfo] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)

  const [owner, setOwner] = useState('')

  const { isFormDisabled, disableForm, enableForm } = useForm()
  const { isFieldsValid, touchField, getFieldErrorMessage, touchForm } =
    useFormValidation(
      {
        address,
        tokenId,
        transferTo,
      },
      {
        address: { required },
        tokenId: { required },
        transferTo: { addressValidator },
      },
    )

  const isFormValid = () => {
    touchForm()

    return isFieldsValid
  }

  const initContract = () => {
    erc721.init(address)
  }

  const triggerTokenInfoFetching = () => {
    if (!isFormValid()) return

    disableForm()
    initContract()
    setIsFetchingTokenInfo(true)
  }

  const triggerTokenTransfer = () => {
    if (!isFormValid()) return

    disableForm()
    initContract()
    setIsTransferring(true)
  }

  const getTokenInfo = useCallback(async () => {
    try {
      const owner = await erc721.getOwner(tokenId)

      if (!owner) return

      setOwner(owner)
    } catch (error) {
      ErrorHandler.process(error)
      setOwner('')
    }
    setIsFetchingTokenInfo(false)
    enableForm()
  }, [enableForm, erc721, tokenId])

  // 0x880AcbaE60579232cEF4e5e1589532786a522059
  // 0xb8e11752853cA722C1aF55d33644bc99dEf31bb2

  // 0xd9f07711Ca0d117Acb7F51B1aFea8783D100F434
  // 0
  // 0x23f6C30DAE5eC6Ab805cb3F96D7BA9484899F4fb

  const transferNft = useCallback(async () => {
    if (!provider?.selectedAddress) return

    try {
      await erc721.transfer(provider.selectedAddress, transferTo, tokenId)

      Bus.success('Succesful transfer')
    } catch (error) {
      ErrorHandler.process(error)
    }

    setIsTransferring(false)
    enableForm()
  }, [enableForm, erc721, tokenId, transferTo, provider?.selectedAddress])

  useEffect(() => {
    if (!isFetchingTokenInfo || !erc721.isInitialized) return

    getTokenInfo()
  }, [isFetchingTokenInfo, erc721.isInitialized, getTokenInfo])

  useEffect(() => {
    if (!isTransferring || !erc721.isInitialized) return

    transferNft()
  }, [isTransferring, erc721.isInitialized, transferNft])
  return (
    <>
      {provider?.isConnected && (
        <form className='erc721-test'>
          <p>Test ERC721</p>
          <TextField
            variant='outlined'
            label='Token address'
            color='primary-light'
            disabled={isFormDisabled}
            value={address}
            error={Boolean(getFieldErrorMessage('address'))}
            helperText={getFieldErrorMessage('address')}
            onChange={e => {
              setAddress(e.target.value)
            }}
            onBlur={() => touchField('address')}
          />
          <TextField
            variant='outlined'
            type='number'
            label='Token id'
            color='primary-light'
            disabled={isFormDisabled}
            value={tokenId}
            error={Boolean(getFieldErrorMessage('tokenId'))}
            helperText={getFieldErrorMessage('tokenId')}
            onChange={e => {
              setTokenId(e.target.value)
            }}
            onBlur={() => touchField('tokenId')}
          />
          <TextField
            variant='outlined'
            label='Transfer to'
            color='primary-light'
            disabled={isFormDisabled}
            value={transferTo}
            error={Boolean(getFieldErrorMessage('transferTo'))}
            helperText={getFieldErrorMessage('transferTo')}
            onChange={e => {
              setTransferTo(e.target.value)
            }}
            onBlur={() => touchField('transferTo')}
          />
          <Button
            disabled={isFormDisabled}
            variant='contained'
            color='primary-main'
            endIcon={<DeleteForever />}
            onClick={() => triggerTokenInfoFetching()}
          >
            Get info
          </Button>
          <Button
            disabled={isFormDisabled}
            variant='contained'
            color='primary-main'
            endIcon={<Icon name={ICON_NAMES.arrowDown} />}
            onClick={() => triggerTokenTransfer()}
          >
            Transfer
          </Button>
          {owner && <p>{`Owner: ${owner}`}</p>}
        </form>
      )}
    </>
  )
}

export default Erc721Test
