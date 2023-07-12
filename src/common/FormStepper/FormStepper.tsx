import './styles.scss'

import { FC, ReactNode, useCallback, useMemo, useState } from 'react'

import { MountedTeleport } from '@/common'
import { FormStepperIndicator, FormStepperSwitcher } from '@/common/FormStepper'

type SwitcherProps = Parameters<typeof FormStepperSwitcher>[0]

type Props = {
  steps: Array<{
    label: string
    component: ReactNode
    isStepValid: () => boolean
  }>
  onSubmit: () => void
  disabled?: boolean
  customSwitcher?: FC<SwitcherProps>
  teleportIndicatorRootId?: string
}

const FormStepper: FC<Props> = ({
  steps,
  onSubmit,
  customSwitcher,
  disabled = false,
  teleportIndicatorRootId,
}) => {
  const [activeStep, setActiveStep] = useState(0)

  const StepSwitcher = useMemo(
    () => customSwitcher ?? FormStepperSwitcher,
    [customSwitcher],
  )

  const currentStep = useMemo(() => steps[activeStep], [activeStep, steps])

  const isLastStep = useMemo(
    () => activeStep === steps.length - 1,
    [activeStep, steps],
  )

  const isFirstStep = useMemo(() => activeStep === 0, [activeStep])

  const toPrevStep = useCallback(() => {
    setActiveStep(prev => {
      if (isFirstStep) return prev

      return prev - 1
    })
  }, [setActiveStep, isFirstStep])

  const toNextStep = useCallback(() => {
    if (!currentStep.isStepValid()) return

    if (isLastStep) {
      onSubmit()
      return
    }

    setActiveStep(prev => {
      if (isLastStep) return prev

      return prev + 1
    })
  }, [setActiveStep, onSubmit, isLastStep, currentStep])

  return (
    <div className='form-stepper'>
      {teleportIndicatorRootId ? (
        <MountedTeleport targetId={teleportIndicatorRootId}>
          <FormStepperIndicator steps={steps} activeStep={activeStep} />
        </MountedTeleport>
      ) : (
        <section className='form-stepper__steps-wrapper'>
          <FormStepperIndicator steps={steps} activeStep={activeStep} />
        </section>
      )}

      <section className='form-stepper__content'>
        {currentStep.component}

        <StepSwitcher
          onNext={toNextStep}
          onPrev={toPrevStep}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          disabled={disabled}
        />
      </section>
    </div>
  )
}

export default FormStepper
