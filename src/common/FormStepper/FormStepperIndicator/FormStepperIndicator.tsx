import './styles.scss'

import { FC, ReactNode } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

type Props = {
  steps: Array<{
    label: string
    component: ReactNode
  }>
  activeStep: number
}

const FormStepperIndicator: FC<Props> = ({ steps, activeStep }) => {
  return (
    <section className='form-stepper-indicator'>
      {steps.map(({ label }, idx) => (
        <div
          className={`form-stepper-indicator__steps form-stepper-indicator__steps--${
            activeStep < idx ? 'disabled' : 'active'
          }`}
          key={idx + label}
        >
          <Icon
            className='form-stepper-indicator__icon'
            name={
              activeStep > idx ? ICON_NAMES.checkFilled : ICON_NAMES.checkEmpty
            }
          />
          <p>{label}</p>
        </div>
      ))}
    </section>
  )
}

export default FormStepperIndicator
