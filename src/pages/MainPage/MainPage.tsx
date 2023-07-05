import './styles.scss'

import { Button } from '@mui/material'
import { motion, MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Erc721Test } from '@/common'
import { config } from '@/config'
import { ETHEREUM_CHAINS, POLYGON_CHAINS, Q_CHAINS } from '@/enums'
import { FileField } from '@/fields'
import { ErrorHandler } from '@/helpers'
import { useAppSelector } from '@/store'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

type Chain = Q_CHAINS | POLYGON_CHAINS | ETHEREUM_CHAINS

const MainPage: FC<Props> = ({ ...rest }) => {
  const { t } = useTranslation()

  const provider = useAppSelector(state => state.web3ProvidersSlice.provider)

  const [files, setFiles] = useState<File[]>([])

  const handleFileUpload = async () => {
    if (!files.length) return

    try {
      const formData = new FormData()

      for (const file of files) {
        formData.append(config.MULTER_FILE_IDENTIFIER, file)
      }

      await fetch(`${config.API_URL}/integrations/media`, {
        method: 'POST',
        body: formData,
      })
    } catch (error) {
      ErrorHandler.process(error)
    }
  }

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

      <div className='main-page__fields'>
        <h4>File field</h4>
        <FileField
          files={files}
          setFiles={setFiles}
          label='Photos'
          subtitle='Any image less than 5 mb'
        />
        <Button
          variant='contained'
          color='primary-main'
          onClick={handleFileUpload}
        >
          {'SEND FILE'}
        </Button>
      </div>

      {/* <img
        src='http://localhost:9000/test-bucket/1c65423f-783d-464e-bafd-858db2282f7a.png'
        alt='test'
      /> */}
    </motion.div>
  )
}

export default MainPage
