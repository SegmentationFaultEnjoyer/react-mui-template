import injectedWalletsModule from '@web3-onboard/injected-wallets'
import { init, Web3OnboardProvider } from '@web3-onboard/react'
import torusModule from '@web3-onboard/torus'
import trustModule from '@web3-onboard/trust'

import { CHAINS as DEFAULT_CHAINS } from '@/consts'
import { PROVIDERS } from '@/enums'

export type Chains = Parameters<typeof init>[0]['chains']
export type OnBoardApi = ReturnType<typeof init>

type AppMetaData = Parameters<typeof init>[0]['appMetadata']
type AccountCenterOpts = Parameters<typeof init>[0]['accountCenter']
type ConnectOpts = Parameters<typeof init>[0]['connect']
type Wallets = Parameters<typeof init>[0]['wallets']

type InitOpts = Parameters<typeof init>[0] & {
  providers?: PROVIDERS[]
}

const supportedWallets = new Map<PROVIDERS, Wallets[0]>([
  [PROVIDERS.metamask, injectedWalletsModule()],
  [PROVIDERS.torus, torusModule()],
  [PROVIDERS.trust, trustModule()],
])

const defaultProviders = [PROVIDERS.metamask, PROVIDERS.torus, PROVIDERS.trust]

// Info that will be displayed in account center
const appMetadataPlaceholder: AppMetaData = {
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

export function useWallet() {
  const _getWalletsList = async (walletNames: PROVIDERS[]) => {
    const providers = walletNames.map(wallet => {
      const provider = supportedWallets.get(wallet)

      if (!provider) throw new Error(`${wallet} is unsupported`)

      return provider
    })

    return providers
  }

  const initWallets = async (opts?: Partial<InitOpts>): Promise<OnBoardApi> => {
    const walletsList = await _getWalletsList(
      opts?.providers ? opts.providers : defaultProviders,
    )

    const web3Onboard = init({
      wallets: walletsList,
      chains: opts?.chains ? opts.chains : DEFAULT_CHAINS,
      appMetadata: opts?.appMetadata
        ? opts.appMetadata
        : appMetadataPlaceholder,
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
