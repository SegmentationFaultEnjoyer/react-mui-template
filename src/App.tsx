import { ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import { useEffectOnce } from 'react-use'

import { useViewportSizes, useWallet } from '@/hooks'
import { AppRoutes } from '@/routes'
import GlobalMUIStyles from '@/theme'
import { OnBoardApi } from '@/types'

export const App = () => {
  useViewportSizes()

  const { WalletProvider, initWallets } = useWallet()

  const [onBoardApi, setOnBoardApi] = useState<OnBoardApi>()

  useEffectOnce(() => {
    const init = async () => {
      const web3OnBoard = await initWallets()

      setOnBoardApi(web3OnBoard)
    }
    init()
  })

  return (
    <ThemeProvider theme={GlobalMUIStyles}>
      {onBoardApi && (
        <WalletProvider web3Onboard={onBoardApi}>
          <div className='app'>
            <AppRoutes />
          </div>
        </WalletProvider>
      )}
    </ThemeProvider>
  )
}
