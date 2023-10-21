import { createContext, FC, HtmlHTMLAttributes, memo, useMemo } from 'react'

import { config } from '@/config'
import { hexToNumber } from '@/helpers'
import { useProvider } from '@/hooks'

type Web3ProviderContextValue = {
  provider?: ReturnType<typeof useProvider>

  isValidChain: boolean
}

export const web3ProviderContext = createContext<Web3ProviderContextValue>({
  provider: undefined,
  isValidChain: false,
})

type Props = HtmlHTMLAttributes<HTMLDivElement>

const Web3ProviderContextProvider: FC<Props> = ({ children }) => {
  const provider = useProvider()

  const isValidChain = useMemo(
    () =>
      !provider.isPerformingOperation &&
      parseInt(config.CHAIN_ID) === hexToNumber(provider.chainId),
    [provider.chainId, provider.isPerformingOperation],
  )

  return (
    <web3ProviderContext.Provider value={{ provider, isValidChain }}>
      {provider.currentProvider && children}
    </web3ProviderContext.Provider>
  )
}

export default memo(Web3ProviderContextProvider)
