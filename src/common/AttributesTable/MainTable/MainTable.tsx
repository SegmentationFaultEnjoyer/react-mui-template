import './style.scss'

import { isEqual } from 'lodash-es'
import { FC, useCallback, useState } from 'react'
import { useUpdateEffect } from 'react-use'

import { resizeArray, setNestedArrayElement } from '@/helpers'

interface Props {
  table: number[][]
  setTable: (payload: number[][]) => void
  disabled?: boolean
}

const MainTable: FC<Props> = ({ table, setTable, disabled = false }) => {
  const [mainTable, setMainTable] = useState(table)

  const setInputValue = useCallback(
    (value: string, row: number, column: number) => {
      setNestedArrayElement(
        setMainTable,
        !isNaN(Number(value)) ? Number(value) : 0,
        row,
        column,
      )
    },
    [setMainTable],
  )

  useUpdateEffect(() => {
    if (isEqual(mainTable, table)) return

    const newTable: Array<number[]> = []

    for (let i = 0; i < table.length; i++) {
      const newRow = resizeArray(mainTable[i], table[i].length, 0)

      newTable.push(newRow)
    }

    setTable(newTable)

    setMainTable(newTable)
  }, [table])

  useUpdateEffect(() => {
    if (isEqual(mainTable, table)) return

    setTable(mainTable)
  }, [mainTable])

  return (
    <main className='main-table'>
      {mainTable.map((row, rowIdx) => (
        <div key={rowIdx} className='main-table__row'>
          {row.map((value, cellIdx) => (
            <input
              key={`${rowIdx}${cellIdx}`}
              className='main-table__input'
              disabled={disabled}
              value={value}
              onChange={e => {
                setInputValue(e.target.value, rowIdx, cellIdx)
              }}
            />
          ))}
        </div>
      ))}
    </main>
  )
}

export default MainTable
