import { Dispatch, SetStateAction } from 'react'

type StateSetter<T> = Dispatch<SetStateAction<T>>

export function setNestedFieldInArray<T extends object>(
  stateSetter: StateSetter<T[]>,
  index: number,
  fieldKey: keyof T,
  fieldValue: T[keyof T],
) {
  stateSetter(prev => {
    const oldObject = [...prev].find((_, idx) => idx === index)

    if (!oldObject) return prev

    const newObject = {
      ...oldObject,
      [fieldKey]: fieldValue,
    }

    const newState = [...prev]
    newState[index] = newObject

    return newState
  })
}

export function setArrayElement<T>(
  stateSetter: StateSetter<T[]>,
  element: T,
  index: number,
) {
  stateSetter(prev => {
    const newState = [...prev]
    newState[index] = element

    return newState
  })
}

export function setNestedArrayElement<T>(
  stateSetter: StateSetter<T[][]>,
  element: T,
  rowIndex: number,
  columnIndex: number,
) {
  stateSetter(prev => {
    const newState = [...prev]

    newState[rowIndex][columnIndex] = element

    return newState
  })
}

export function resizeArray<T>(
  array: T[],
  newSize: number,
  defaultValue?: T | null,
) {
  const currentSize = array.length
  const valueToFill = defaultValue ?? ''

  if (newSize < currentSize) return array.slice(0, newSize)

  if (newSize > currentSize) {
    const diff = newSize - currentSize
    const additionalElements = Array(diff).fill(valueToFill)

    return array.concat(additionalElements)
  }

  return array
}
