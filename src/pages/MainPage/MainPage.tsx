import './styles.scss'

import { Button } from '@mui/material'
import { motion, MotionProps } from 'framer-motion'
import { FC, HTMLAttributes, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { config } from '@/config'
import { web3ProviderContext } from '@/contexts'
import { ETHEREUM_CHAINS, POLYGON_CHAINS, Q_CHAINS } from '@/enums'
import { FileField } from '@/fields'
import { ErrorHandler } from '@/helpers'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

type Chain = Q_CHAINS | POLYGON_CHAINS | ETHEREUM_CHAINS

const MainPage: FC<Props> = ({ ...rest }) => {
  const { t } = useTranslation()

  const { provider } = useContext(web3ProviderContext)

  const [files, setFiles] = useState<File[]>([])

  const handleFileUpload = async () => {
    if (!files.length) return

    try {
      const formData = new FormData()

      for (const file of files) {
        formData.append(config.MULTER_FILE_IDENTIFIER, file)
      }

      await fetch(`${config.API_URL}/blob-svc`, {
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
    </motion.div>
  )
}

export default MainPage
