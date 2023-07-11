import './style.scss'

import {
  alpha,
  FormControl,
  InputBase,
  InputBaseProps,
  styled,
} from '@mui/material'
import { FC, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

type Props = InputBaseProps & { label: string }

const TextFieldStyled = styled(InputBase)(({ theme }) => ({
  '& .MuiInputBase-input': {
    borderRadius: 8,
    border: '1px solid',
    borderColor: '#D9DBE3',
    fontSize: 14,
    padding: '12px 11px',
    color: '#12181C',
    width: 'auto',
    height: '22px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      borderColor: theme.palette['primary-main'].main,
    },
    '&:focus': {
      boxShadow: `${alpha(
        theme.palette['primary-main'].main,
        0.25,
      )} 0 0 0 0.2rem`,
      borderColor: theme.palette['primary-main'].main,
    },
  },
}))

const TextField: FC<Props> = ({ label, ...rest }) => {
  const uid = useMemo(() => uuid(), [])

  return (
    <FormControl>
      {label && (
        <label className='text-field__label' htmlFor={`text-field--${uid}`}>
          {label}
        </label>
      )}
      <TextFieldStyled id={`text-field--${uid}`} {...rest} />
    </FormControl>
  )
}

export default TextField
