import { FC, HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { ErrorHandler, sleep } from '@/helpers'

const MAX_RETRIES = 10
const DEFAULT_RETRY_INTERVAL = 100

type Props = {
  targetId: string
} & HTMLAttributes<HTMLDivElement>

const MountedTeleport: FC<Props> = ({ targetId, children }) => {
  const [teleportTarget, setTeleportTarget] = useState<HTMLElement | null>(null)

  const waitUntilTargetMounted = useCallback(
    async (retryDelay = DEFAULT_RETRY_INTERVAL) => {
      let teleportTarget = document.getElementById(targetId)
      let tryNumber = 0

      try {
        while (!teleportTarget) {
          if (tryNumber > MAX_RETRIES)
            throw new Error('No node with such id found')

          teleportTarget = document.getElementById(targetId)

          if (teleportTarget) break

          tryNumber++
          await sleep(retryDelay)
        }

        setTeleportTarget(teleportTarget)
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    [targetId, setTeleportTarget],
  )

  useEffect(() => {
    waitUntilTargetMounted()
  }, [targetId, waitUntilTargetMounted])

  return (
    <>
      {teleportTarget instanceof HTMLElement &&
        createPortal(children, teleportTarget)}
    </>
  )
}

export default MountedTeleport
