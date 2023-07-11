export type AttributeInitialInfo = {
  name: string
  amount: string
}

export type Declaration = {
  key: string
  value: string[]
}

export type Attributes = {
  declaration: Declaration[]
  values: number[][]
}
