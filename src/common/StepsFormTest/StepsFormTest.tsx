import './styles.scss'

import { Button, TextField } from '@mui/material'
import { Dispatch, FC, useCallback, useMemo, useReducer } from 'react'

import { FormStepper } from '@/common'
import { ErrorHandler, genericReducer, sleep } from '@/helpers'
import { useForm, useFormValidation } from '@/hooks'
import { DispatchAction } from '@/types'
import { email, maxLength, minLength, required } from '@/validators'

type ValidationController = ReturnType<typeof useFormValidation>

type StepProps<T extends object> = {
  state: T
  dispatch: Dispatch<DispatchAction<T>>
  validationController: ValidationController
  label: string
  disabled?: boolean
}

const TemplateStep: FC<StepProps<{ [key: string]: unknown }>> = ({
  state,
  dispatch,
  label,
  disabled = false,
  validationController: { getFieldErrorMessage, touchField },
}) => {
  return (
    <form className='step'>
      <h4>{label}</h4>
      {Object.entries(state).map(([key, value]) => (
        <TextField
          key={key}
          label={key}
          value={value}
          disabled={disabled}
          error={Boolean(getFieldErrorMessage(key))}
          helperText={getFieldErrorMessage(key)}
          onBlur={() => touchField(key)}
          onChange={e => {
            dispatch({
              type: key,
              payload: e.target.value,
            })
          }}
        />
      ))}
    </form>
  )
}

type SwitcherType = NonNullable<
  Parameters<typeof FormStepper>[0]['customSwitcher']
>
type SwitcherProps = Parameters<SwitcherType>[0]

const CustomSwitcher: FC<SwitcherProps> = ({
  onNext,
  onPrev,
  isLastStep = false,
  isFirstStep = true,
  disabled = false,
}) => {
  const nextButtonText = useMemo(
    () => (!isLastStep ? 'PROCEED' : 'FINISH'),
    [isLastStep],
  )

  return (
    <section className='form-stepper-switcher'>
      {!isFirstStep && (
        <Button
          color='tertiary-dark'
          variant='outlined'
          size='large'
          disabled={disabled}
          onClick={onPrev}
        >
          previous step
        </Button>
      )}

      <Button
        color='tertiary-dark'
        variant='contained'
        disabled={disabled}
        onClick={onNext}
      >
        {nextButtonText}
      </Button>
    </section>
  )
}

const StepsFormTest: FC = () => {
  const [firstStepState, dispatchFirstStep] = useReducer(
    genericReducer<{
      name: string
      surname: string
    }>,
    {
      name: '',
      surname: '',
    },
  )
  const [secondStepState, dispatchSecondStep] = useReducer(
    genericReducer<{
      email: string
      telegram: string
    }>,
    {
      email: '',
      telegram: '',
    },
  )
  const [thirdStepState, dispatchThirdStep] = useReducer(
    genericReducer<{
      instagram: string
    }>,
    {
      instagram: '',
    },
  )

  const [fourthStepState, dispatchFourthStep] = useReducer(
    genericReducer<{
      someInfo: string
    }>,
    {
      someInfo: '',
    },
  )

  const { isFormDisabled, enableForm, disableForm } = useForm()

  const validationController = useFormValidation(
    {
      ...firstStepState,
      ...secondStepState,
      ...thirdStepState,
      ...fourthStepState,
    },
    {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(10),
      },
      surname: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(10),
      },
      email: {
        required,
        email,
      },
      telegram: {
        required,
      },
      instagram: {
        required,
      },
      someInfo: { required },
    },
  )

  const isStepValid = useCallback(
    (state: Record<string, unknown>, validator: ValidationController) => {
      const { isFieldValid, touchField } = validator

      let isValid = true

      for (const key of Object.keys(state)) {
        touchField(key)

        if (!isFieldValid(key)) isValid = false
      }

      return isValid
    },
    [],
  )

  const mockedSteps: Parameters<typeof FormStepper>[0]['steps'] = [
    {
      label: 'Design',
      component: (
        <TemplateStep
          label='Step 1'
          state={firstStepState}
          disabled={isFormDisabled}
          dispatch={dispatchFirstStep}
          validationController={validationController}
        />
      ),
      isStepValid: () => isStepValid(firstStepState, validationController),
    },
    {
      label: 'Social Media',
      component: (
        <TemplateStep
          label='Step 2'
          state={secondStepState}
          disabled={isFormDisabled}
          dispatch={dispatchSecondStep}
          validationController={validationController}
        />
      ),
      isStepValid: () => isStepValid(secondStepState, validationController),
    },
    {
      label: 'Payments',
      component: (
        <TemplateStep
          label='Step 3'
          state={thirdStepState}
          disabled={isFormDisabled}
          dispatch={dispatchThirdStep}
          validationController={validationController}
        />
      ),
      isStepValid: () => isStepValid(thirdStepState, validationController),
    },
    {
      label: 'Accesses',
      component: (
        <TemplateStep
          label='Step 4'
          state={fourthStepState}
          disabled={isFormDisabled}
          dispatch={dispatchFourthStep}
          validationController={validationController}
        />
      ),
      isStepValid: () => isStepValid(fourthStepState, validationController),
    },
  ]

  const submit = async () => {
    disableForm()
    try {
      //   const finalState = {
      //     ...firstStepState,
      //     ...secondStepState,
      //     ...thirdStepState,
      //     ...fourthStepState,
      //   }

      //   console.log(finalState)

      await sleep(1000)
    } catch (error) {
      ErrorHandler.process(error)
    }
    enableForm()
  }

  return (
    <div className='steps-form-test'>
      <section className='steps-form-test__default'>
        <h4>Default stepper</h4>
        <FormStepper
          steps={mockedSteps}
          onSubmit={submit}
          disabled={isFormDisabled}
        />
      </section>

      <section className='steps-form-test__default'>
        <h4>Stepper with teleported indicator</h4>
        <section className='steps-form-test__teleported'>
          <nav
            className='steps-form-test___teleported-nav'
            id='teleport-target'
          ></nav>
          <FormStepper
            steps={mockedSteps}
            onSubmit={submit}
            disabled={isFormDisabled}
            teleportIndicatorRootId='teleport-target'
          />
        </section>
      </section>

      <section className='steps-form-test__default'>
        <h4>Stepper with custom controls</h4>
        <FormStepper
          steps={mockedSteps}
          onSubmit={submit}
          disabled={isFormDisabled}
          customSwitcher={CustomSwitcher}
        />
      </section>
    </div>
  )
}

export default StepsFormTest
