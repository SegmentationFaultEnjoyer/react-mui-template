import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'

import { AppNavbar } from '@/common'
import { Web3ProviderContextProvider } from '@/contexts'
import { RoutesPaths } from '@/enums'

export const AppRoutes = () => {
  const MainPage = lazy(() => import('@/pages/MainPage'))

  const pageAnimationOpts = {
    initial: 'hide',
    animate: 'show',
    exit: 'hide',
    variants: {
      hide: {
        opacity: 0,
      },
      show: {
        opacity: 1,
      },
    },
    transition: { duration: 0.5 },
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Suspense fallback={<></>}>
          <Web3ProviderContextProvider>
            <AppNavbar className='app__navbar' />
            <AnimatePresence>
              <Outlet />
            </AnimatePresence>
          </Web3ProviderContextProvider>
        </Suspense>
      ),
      children: [
        {
          path: RoutesPaths.main,
          element: <MainPage {...pageAnimationOpts} />,
        },
        {
          path: '/',
          element: <Navigate replace to={RoutesPaths.main} />,
        },
        {
          path: '*',
          element: <Navigate replace to={RoutesPaths.main} />,
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
