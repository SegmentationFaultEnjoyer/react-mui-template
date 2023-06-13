import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UseProvider } from '@/types'

interface Web3ProvidersState {
  provider?: UseProvider
}

const initialState: Web3ProvidersState = {
  provider: undefined,
}

export const web3ProvidersSlice = createSlice({
  name: 'web3-providers-slice',
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<UseProvider>) => {
      state.provider = action.payload
    },
  },
})

export const { setProvider } = web3ProvidersSlice.actions

export default web3ProvidersSlice.reducer
