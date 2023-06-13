import './styles.scss'

import { Button } from '@mui/material'
import { FC, HTMLAttributes, useEffect, useMemo } from 'react'

import { AppLogo } from '@/common'
import { useProvider } from '@/hooks'
import { setProvider, useAppDispatch } from '@/store'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  ...rest
}) => {
  const dispatch = useAppDispatch()
  const provider = useProvider()

  const connectBtnText = useMemo(
    () =>
      provider.selectedAddress ? provider.selectedAddress : 'Connect Wallet',
    [provider.selectedAddress],
  )

  useEffect(() => {
    dispatch(setProvider(provider))
  }, [provider, dispatch])

  return (
    <div className={`app-navbar ${className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />
      <Button
        disabled={provider.isPerformingOperation}
        variant='contained'
        color='primary_main'
        onClick={() => provider.connect()}
      >
        {connectBtnText}
      </Button>
      <Button
        disabled={provider.isPerformingOperation}
        variant='outlined'
        color='primary_main'
        onClick={() => provider.disconnect()}
      >
        {'Disconnect'}
      </Button>
      {provider.chainId && <p>{`Current chain: ${provider.chainId}`}</p>}
      <p>{provider.isConnected ? 'true' : 'false'}</p>
    </div>
  )
}

export default AppNavbar
