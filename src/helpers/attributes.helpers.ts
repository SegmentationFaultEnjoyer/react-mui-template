import { AttributeInitialInfo, Declaration } from '@/types'

// table.get(attr1, attr2) => stock_count
/* 
    [{key: 'size', value: ['s', 'l']}, {key: 'color', value: ['r', 'g', 'b']}]
    [
        [2, 4]
        [1, 3],
        [5, 6]
    ]

    ['s', 'l']
    _____________
    'r' => [2, 4]
    'g' => [1, 3]
    'b' => [5, 6]
*/

export class AttributesTable {
  private table = new Map<string, number[]>()
  private navigation: string[] = []

  constructor(declaration: Declaration[], table: number[][]) {
    const [firstAttr, secondAttr] = declaration

    this.navigation = firstAttr.value

    this.createTable(secondAttr.value, table)
  }

  private createTable(keys: string[], table: number[][]) {
    for (let i = 0; i < keys.length; i++) {
      this.table.set(keys[i], table[i])
    }
  }

  private getColumnIndex(key: string) {
    return this.navigation.findIndex(el => el === key)
  }

  public getValue(rowKey: string, columnKey: string): number {
    const row = this.table.get(rowKey)

    if (!row) throw new Error(`invalid row key, '${rowKey}'`)

    const columnIndex = this.getColumnIndex(columnKey)

    const value = row.at(columnIndex)

    if (!value) throw new Error(`invalid column key '${columnKey}'`)

    return Number(value)
  }

  public static createDeclaration(
    attributes: AttributeInitialInfo[],
  ): Declaration[] {
    const declaration: Declaration[] = []

    for (const attr of attributes) {
      declaration.push({
        key: attr.name,
        value: new Array(Number(attr.amount)).fill(''),
      })
    }

    return declaration
  }

  public static createTableValues(
    attributes: AttributeInitialInfo[],
  ): number[][] {
    const table: number[][] = []

    const [firstAttr, secondAttr] = attributes

    const columnsAmount = Number(firstAttr.amount)
    const rowsAmount = secondAttr ? Number(secondAttr.amount) : 1

    for (let i = 0; i < rowsAmount; i++) {
      const row = new Array(columnsAmount).fill(0)
      table.push(row)
    }

    return table
  }
}
