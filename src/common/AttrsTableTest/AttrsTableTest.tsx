import './styles.scss'

import { JsonApiBodyBuilder } from '@distributedlab/jac'
import { Button } from '@mui/material'
import { FC, FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUpdateEffect } from 'react-use'

import { api } from '@/api'
import { AttributesTable } from '@/common'
import { SelectField, TextField } from '@/fields'
import {
  AttributesTable as AttributesHandler,
  ErrorHandler,
  setNestedFieldInArray,
} from '@/helpers'
import { useForm, useFormValidation } from '@/hooks'
import { AttributeInitialInfo, Attributes, Declaration } from '@/types'
import { maxLength, maxValue, minValue, required } from '@/validators'

type ValidationRules = Parameters<typeof useFormValidation>[1]

const emptyObject = { name: 'test', amount: '2' }

const mockedMarketItem = {
  name: 'Test',
  description: 'Test desc',
  price: 10,
  isMembersOnly: false,
  images: [
    {
      url: 'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/17a84b9e-a7a9-45d6-abf5-073ef8c05b4c.jpeg',
    },
    {
      url: 'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/444e3f54-30d2-4028-a6a0-4afc2404fe98.jpeg',
    },
  ],
  tags: [
    {
      name: 'winter',
    },
  ],
}

// eslint-disable-next-line
const testTable2Attrs: {
  declaration: Declaration[]
  values: number[][]
} = {
  declaration: [
    { key: 'size', value: ['S', 'XS', 'L'] },
    { key: 'color', value: ['Green', 'Red', 'Blue', 'White'] },
  ],
  values: [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
  ],
}

const AttrsTableTest: FC = () => {
  const MAX_COUNT_VALUE = 1000
  const MAX_ATTR_NAME_LENGTH = 7

  const [numberOfAttrs, setNumberOfAttrs] = useState('2')
  const [attributes, setAttributes] = useState<Attributes | undefined>()
  const [attributesInitialInfo, setAttributesInitialInfo] = useState<
    AttributeInitialInfo[]
  >(new Array(Number(numberOfAttrs)).fill({ ...emptyObject }))

  const quantityChoices = useMemo(
    () => new Array(5).fill('').map((_, idx) => (idx + 1).toString()),
    [],
  )

  const numberOfAttrsChoices = useMemo(
    () => new Array(3).fill('').map((_, idx) => idx.toString()),
    [],
  )

  const validationRules = useMemo<ValidationRules>(
    () =>
      !attributes
        ? ({} as ValidationRules)
        : {
            attributes: {
              required,
              declaration: {
                required,
                $every: {
                  key: {
                    required,
                  },
                  value: {
                    required,
                    $every: {
                      required,
                      maxLength: maxLength(MAX_ATTR_NAME_LENGTH),
                    },
                  },
                },
              },
              values: {
                required,
                $every: {
                  required,
                  $every: {
                    required,
                    minValue: minValue(0),
                    maxValue: maxValue(MAX_COUNT_VALUE),
                  },
                },
              },
            },
          },
    [attributes],
  )

  useEffect(() => {
    initAttributes(attributesInitialInfo)
  }, [attributesInitialInfo])

  useUpdateEffect(() => {
    setAttributesInitialInfo(
      new Array(Number(numberOfAttrs)).fill({ ...emptyObject }),
    )
  }, [numberOfAttrs])

  const { t } = useTranslation()

  const { isFormDisabled, enableForm, disableForm } = useForm()
  const { isFieldsValid, touchForm } = useFormValidation(
    { attributes },
    validationRules,
  )

  const setAttrQuantity = useCallback(
    (amount: string, index: number) => {
      setNestedFieldInArray(setAttributesInitialInfo, index, 'amount', amount)
    },
    [setAttributesInitialInfo],
  )

  const setAttrName = useCallback(
    (newName: string, index: number) => {
      setNestedFieldInArray(setAttributesInitialInfo, index, 'name', newName)
    },
    [setAttributesInitialInfo],
  )

  const initAttributes = (initInfo: AttributeInitialInfo[]) => {
    if (!initInfo.every(attr => Boolean(attr.name))) return

    setAttributes({
      declaration: AttributesHandler.createDeclaration(initInfo),
      values: AttributesHandler.createTableValues(initInfo),
    })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()

    if (!attributes) return

    touchForm()

    if (!isFieldsValid) return

    disableForm()
    try {
      const data = new JsonApiBodyBuilder()
        .setType('item')
        .setAttributes({
          ...mockedMarketItem,
          declaration: attributes.declaration,
          stockCount: attributes.values,
        })
        .build()

      //   console.log(data)

      await api.post('/integrations/marketplace', {
        body: data,
      })
    } catch (error) {
      ErrorHandler.process(error)
    }
    enableForm()
  }

  return (
    <div className='attrs-table-test'>
      <section className='attrs-table-test__fields'>
        <SelectField
          label='Number of attributes'
          value={numberOfAttrs}
          setValue={setNumberOfAttrs}
          choices={numberOfAttrsChoices}
        />

        {attributesInitialInfo.map((attr, idx) => (
          <div className='attrs-table-test__fields-wrapper' key={idx}>
            <TextField
              label={`${idx + 1} attribute type`}
              value={attr.name}
              onChange={e => {
                setAttrName(e.target.value, idx)
              }}
            />
            <SelectField
              label='Quantity'
              value={attr.amount}
              setValue={newValue => {
                setAttrQuantity(newValue.toString(), idx)
              }}
              choices={quantityChoices}
            />
          </div>
        ))}
      </section>
      {attributes && (
        <form className='attrs-table-test__attr-table' onSubmit={submit}>
          <AttributesTable
            attributes={attributes}
            setAttributes={setAttributes}
            declarationDisabled={isFormDisabled}
            tableDisabled={isFormDisabled}
            errorMessage={
              !isFieldsValid
                ? 'Some of the fields are invalid, make sure that: ' +
                  'every attribute name is filled and no longer than 7 chars and ' +
                  'every stock count value is filled and not greater than 1000.'
                : ''
            }
          />
          <Button
            variant='outlined'
            type='submit'
            disabled={isFormDisabled || !isFieldsValid}
          >
            {t('main-page.save-table-lbl')}
          </Button>
        </form>
      )}
    </div>
  )
}

export default AttrsTableTest
