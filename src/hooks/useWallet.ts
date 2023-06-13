import { init, Web3OnboardProvider } from '@web3-onboard/react'

import { CHAINS as DEFAULT_CHAINS } from '@/consts'
import { PROVIDERS } from '@/enums'

export type Chains = Parameters<typeof init>[0]['chains']
export type OnBoardApi = ReturnType<typeof init>

type AppMetaData = Parameters<typeof init>[0]['appMetadata']
type AccountCenterOpts = Parameters<typeof init>[0]['accountCenter']
type ConnectOpts = Parameters<typeof init>[0]['connect']
type Wallets = Parameters<typeof init>[0]['wallets']

type InitOpts = {
  chains?: Chains
  appMetaData?: AppMetaData
  accountCenter?: AccountCenterOpts
  connect?: ConnectOpts
  wallets?: PROVIDERS[]
}

// Info that will be displayed in account center
const appMetadata: AppMetaData = {
  name: 'Connect Wallet Example',
  icon: '<svg>My App Icon</svg>',
  description: 'Example showcasing how to connect a wallet.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
  ],
}

const accountCenterOpts: AccountCenterOpts = {
  desktop: {
    enabled: false,
  },
  mobile: {
    enabled: false,
  },
}

const connectOpts: ConnectOpts = {
  autoConnectLastWallet: true,
}

const defaultWallets: PROVIDERS[] = [
  PROVIDERS.metamask,
  PROVIDERS.coinbase,
  PROVIDERS.walletConnect,
]

export function useWallet() {
  /* More wallets can be added if needed 
     Check all supported providers here: 
     https://onboard.blocknative.com/docs/wallets/coinbase
  */
  const _getWalletProvider = async (wallet: PROVIDERS) => {
    switch (wallet) {
      case PROVIDERS.coinbase:
        return import('@web3-onboard/coinbase')
      case PROVIDERS.walletConnect:
        return import('@web3-onboard/walletconnect')
      case PROVIDERS.ledger:
        return import('@web3-onboard/ledger')
      case PROVIDERS.trust:
        return import('@web3-onboard/trust')
      case PROVIDERS.phantom:
        return import('@web3-onboard/phantom')
      case PROVIDERS.metamask:
      default:
        return import('@web3-onboard/injected-wallets')
    }
  }

  const _getWalletsList = async (walletNames: PROVIDERS[]) => {
    const providers = []
    for (const wallet of walletNames) {
      const provider = await _getWalletProvider(wallet)

      providers.push((provider.default as unknown as CallableFunction)())
    }

    return providers as unknown as Wallets
  }

  const initWallets = async (opts?: InitOpts): Promise<OnBoardApi> => {
    const walletsList = await _getWalletsList(
      opts?.wallets ? opts.wallets : defaultWallets,
    )

    const web3Onboard = init({
      wallets: walletsList,
      chains: opts?.chains ? opts.chains : DEFAULT_CHAINS,
      appMetadata: opts?.appMetaData ? opts.appMetaData : appMetadata,
      accountCenter: opts?.accountCenter
        ? opts.accountCenter
        : accountCenterOpts,
      connect: opts?.connect ? opts.connect : connectOpts,
    })

    return web3Onboard
  }

  return {
    initWallets,
    WalletProvider: Web3OnboardProvider,
  }
}
