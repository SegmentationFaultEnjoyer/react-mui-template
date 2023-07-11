import './style.scss'

import { isEqual } from 'lodash-es'
import { FC, useCallback, useMemo, useState } from 'react'
import { useUpdateEffect } from 'react-use'

import { resizeArray, setArrayElement } from '@/helpers'
import { Declaration } from '@/types'

type Mode = 'vertical' | 'horizontal'

interface Props {
  mode?: Mode
  withOffset?: boolean
  disabled?: boolean
  declaration: Declaration
  setDeclaration: (payload: Declaration) => void
}

const AttributesDeclaration: FC<Props> = ({
  mode = 'horizontal',
  withOffset = false,
  disabled = false,
  declaration,
  setDeclaration,
}) => {
  const [inputStates, setInputStates] = useState<string[]>(declaration.value)

  const classes = useMemo(
    () =>
      ['attributes-declaration', `attributes-declaration--${mode}`].join(' '),
    [mode],
  )

  const setInputValue = useCallback(
    (value: string, index: number) => {
      setArrayElement(setInputStates, value, index)
    },
    [setInputStates],
  )

  useUpdateEffect(() => {
    if (isEqual(inputStates, declaration.value)) return

    setDeclaration({
      key: declaration.key,
      value: inputStates,
    })
  }, [inputStates, setDeclaration])

  useUpdateEffect(() => {
    if (isEqual(inputStates, declaration.value)) return

    // if declaration changed from the outside --> trying to preserve values

    const newInputs = resizeArray(inputStates, declaration.value.length)

    setDeclaration({
      key: declaration.key,
      value: newInputs,
    })

    setInputStates(newInputs)
  }, [declaration])

  return (
    <div className={classes}>
      {withOffset && <div />}
      {inputStates.map((value, idx) => (
        <input
          className='attributes-declaration__input'
          key={`${declaration.key}${idx}`}
          value={value}
          placeholder={declaration.key}
          disabled={disabled}
          onChange={e => setInputValue(e.target.value, idx)}
        />
      ))}
    </div>
  )
}

export default AttributesDeclaration
