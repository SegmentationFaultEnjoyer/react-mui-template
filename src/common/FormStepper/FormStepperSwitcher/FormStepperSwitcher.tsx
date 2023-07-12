import './styles.scss'

import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { Button } from '@mui/material'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  onNext: () => void
  onPrev: () => void
  isLastStep?: boolean
  isFirstStep?: boolean
  disabled?: boolean
}

const FormStepperSwitcher: FC<Props> = ({
  onNext,
  onPrev,
  isLastStep = false,
  isFirstStep = true,
  disabled = false,
}) => {
  const { t } = useTranslation()

  const nextButtonText = useMemo(
    () =>
      !isLastStep
        ? t('form-stepper.next-step-lbl')
        : t('form-stepper.submit-lbl'),
    [isLastStep, t],
  )

  return (
    <section className='form-stepper-switcher'>
      {!isFirstStep && (
        <Button
          color='primary-light'
          variant='outlined'
          size='large'
          disabled={disabled}
          sx={{ borderRadius: '8px' }}
          startIcon={<ArrowBack />}
          onClick={onPrev}
        >
          {t('form-stepper.prev-step-lbl')}
        </Button>
      )}

      <Button
        color='primary-light'
        variant='contained'
        size='large'
        disabled={disabled}
        sx={{ borderRadius: '8px' }}
        endIcon={!isLastStep && <ArrowForward />}
        onClick={onNext}
      >
        {nextButtonText}
      </Button>
    </section>
  )
}

export default FormStepperSwitcher
