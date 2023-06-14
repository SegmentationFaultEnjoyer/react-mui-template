import './styles.scss'

import { Button } from '@mui/material'
import { motion, MotionProps } from 'framer-motion'
import { FC, HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

import { Erc721Test } from '@/common'
import { ETHEREUM_CHAINS, POLYGON_CHAINS, Q_CHAINS } from '@/enums'
import { useAppSelector } from '@/store'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

type Chain = Q_CHAINS | POLYGON_CHAINS | ETHEREUM_CHAINS

const MainPage: FC<Props> = ({ ...rest }) => {
  const { t } = useTranslation()

  const provider = useAppSelector(state => state.web3ProvidersSlice.provider)

  const switchChain = (chainId: Chain) => {
    if (!provider?.currentProvider) return

    provider.switchChain(chainId)
  }

  return (
    <motion.div className='main-page' {...rest}>
      <h1>Main PAge</h1>
      {provider?.isConnected && (
        <section>
          <p>Switch chain: </p>
          <Button
            disabled={provider.isPerformingOperation}
            variant='contained'
            color='primary-main'
            onClick={() => switchChain(Q_CHAINS.testnet)}
          >
            {t('main-page.q-chain')}
          </Button>
          <Button
            disabled={provider.isPerformingOperation}
            variant='contained'
            color='primary-main'
            onClick={() => switchChain(POLYGON_CHAINS.mumbai)}
          >
            {t('main-page.mumbai-chain')}
          </Button>
          <Button
            disabled={provider.isPerformingOperation}
            variant='contained'
            color='primary-main'
            onClick={() => switchChain(ETHEREUM_CHAINS.sepolia)}
          >
            {t('main-page.sepolia-chain')}
          </Button>
        </section>
      )}
      {provider?.selectedProvider && (
        <p>{`provider: ${provider.selectedProvider}`}</p>
      )}
      <Erc721Test />
    </motion.div>
  )
}

export default MainPage
