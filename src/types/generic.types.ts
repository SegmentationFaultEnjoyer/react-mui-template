export type DispatchAction<T extends object> = {
  type: keyof T
  payload: unknown
}
