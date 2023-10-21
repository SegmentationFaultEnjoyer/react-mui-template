import './styles.scss'

import { Button } from '@mui/material'
import { FC, HTMLAttributes, useContext, useMemo } from 'react'

import { AppLogo } from '@/common'
import { web3ProviderContext } from '@/contexts'

const AppNavbar: FC<HTMLAttributes<HTMLDivElement>> = ({ ...rest }) => {
  const { provider } = useContext(web3ProviderContext)

  const connectBtnText = useMemo(
    () =>
      provider?.selectedAddress ? provider?.selectedAddress : 'Connect Wallet',
    [provider?.selectedAddress],
  )

  return (
    <div className={`app-navbar ${rest.className}`} {...rest}>
      <AppLogo className='app-navbar__logo' />
      <Button
        disabled={provider?.isPerformingOperation}
        variant='contained'
        color='primary-main'
        onClick={() => provider?.connect()}
      >
        {connectBtnText}
      </Button>
      <Button
        disabled={provider?.isPerformingOperation}
        variant='outlined'
        color='primary-main'
        onClick={() => provider?.disconnect()}
      >
        {'Disconnect'}
      </Button>
      {provider?.chainId && <p>{`Current chain: ${provider?.chainId}`}</p>}
      <p>{provider?.isConnected ? 'true' : 'false'}</p>
    </div>
  )
}

export default AppNavbar
