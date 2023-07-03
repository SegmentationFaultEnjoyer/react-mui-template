import './styles.scss'

import { Button } from '@mui/material'
import { motion, MotionProps } from 'framer-motion'
import { shuffle } from 'lodash-es'
import { FC, HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

import { Carousel, Erc721Test, TestCard } from '@/common'
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

  const testImages = [
    'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/17a84b9e-a7a9-45d6-abf5-073ef8c05b4c.jpeg',
    'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/444e3f54-30d2-4028-a6a0-4afc2404fe98.jpeg',
    'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/1a8762ae-8f03-4148-9c9b-225e0270f562.png',
    'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/7b116a8c-5657-4ef7-b9cf-999d668bb459.jpeg',
    'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/13eab5f1-bfbc-419b-8992-74a59f70d7ea.png',
    'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/eff647aa-fee9-4312-914b-0347bfc3f303.jpeg',
    'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/539536f6-3090-4abc-8294-0f8da10fb14d.png',
  ]

  const testProductInfo = {
    title: 'T-SHIRT',
    count: 25,
    totalAmount: 27,
    price: '$78.90',
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
      <h4>{t('main-page.carousel-default')}</h4>
      <section className='main-page__carousel'>
        <Carousel label='test' images={testImages} />
      </section>

      <h4>{t('main-page.carousel-thumbnails')}</h4>
      <section className='main-page__carousel'>
        <Carousel label='test' images={testImages} mode='thumbnail' />
      </section>

      <h4>{t('main-page.carousel-in-card')}</h4>
      <section className='main-page__cards'>
        <TestCard info={testProductInfo} images={testImages} />
        <TestCard info={testProductInfo} images={shuffle(testImages)} />
        <TestCard info={testProductInfo} images={shuffle(testImages)} />
        <TestCard info={testProductInfo} images={shuffle(testImages)} />
      </section>
    </motion.div>
  )
}

export default MainPage
