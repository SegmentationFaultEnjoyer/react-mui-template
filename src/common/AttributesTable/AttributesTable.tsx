import './styles.scss'

import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, FC, SetStateAction, useCallback } from 'react'

import { AttributesDeclaration, MainTable } from '@/common/AttributesTable'
import { Attributes, Declaration } from '@/types'

interface Props {
  attributes: Attributes
  setAttributes: Dispatch<SetStateAction<Attributes | undefined>>
  tableDisabled?: boolean
  declarationDisabled?: boolean
  errorMessage?: string
}

const AttributesTable: FC<Props> = ({
  attributes,
  setAttributes,
  tableDisabled = false,
  declarationDisabled = false,
  errorMessage = '',
}) => {
  const setDeclaration = useCallback(
    (declaration: Declaration) => {
      setAttributes(prev => {
        if (!prev) return prev

        const index = prev.declaration.findIndex(
          el => el.key === declaration.key,
        )

        if (!~index) return prev

        const newState = { ...prev }

        newState.declaration[index] = declaration

        return newState
      })
    },
    [setAttributes],
  )

  const setMainTable = useCallback(
    (table: number[][]) => {
      setAttributes(prev => {
        if (!prev) return prev

        const newState = { ...prev }
        newState.values = table

        return newState
      })
    },
    [setAttributes],
  )

  return (
    <div className='attributes-table'>
      {Boolean(attributes.declaration.length) && (
        <>
          <AttributesDeclaration
            disabled={declarationDisabled}
            declaration={attributes.declaration[0]}
            withOffset={attributes.declaration.length > 1}
            setDeclaration={setDeclaration}
          />
          <section className='attributes-table__main-wrapper'>
            {Boolean(attributes.declaration.length > 1) && (
              <AttributesDeclaration
                disabled={declarationDisabled}
                declaration={attributes.declaration[1]}
                mode='vertical'
                setDeclaration={setDeclaration}
              />
            )}

            <MainTable
              table={attributes.values}
              setTable={setMainTable}
              disabled={tableDisabled}
            />
          </section>
        </>
      )}

      <AnimatePresence>
        {Boolean(errorMessage) && (
          <motion.p
            className='attributes-table__error'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AttributesTable
