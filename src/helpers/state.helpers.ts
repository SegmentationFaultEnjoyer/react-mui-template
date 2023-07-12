import { DispatchAction } from '@/types'

export function genericReducer<T extends object>(
  state: T,
  action: DispatchAction<T>,
) {
  const { type, payload } = action

  const stateKey = Object.keys(state).find(key => key === type)

  if (!stateKey) return state

  return {
    ...state,
    [stateKey]: payload,
  }
}
