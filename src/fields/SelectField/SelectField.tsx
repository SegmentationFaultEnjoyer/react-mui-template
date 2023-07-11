import './styles.scss'

import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { Dispatch, FC, SetStateAction } from 'react'
import { v4 as uuid } from 'uuid'

interface Props {
  value: string
  setValue: Dispatch<SetStateAction<string>>
  label?: string
  size?: 'small' | 'medium'
  variant?: 'outlined' | 'filled' | 'standard'
  choices: Array<string>
}

const SelectSingle: FC<Props> = ({
  value,
  setValue,
  label,
  choices,
  size = 'medium',
  variant = 'outlined',
  ...rest
}) => {
  const handleChange = (e: SelectChangeEvent) => {
    setValue(e.target.value)
  }

  const uid = uuid()

  return (
    <FormControl sx={{ m: 1, width: '90%' }} size={size}>
      {label && (
        <label className='select-field__label' htmlFor={`select-field--${uid}`}>
          {label}
        </label>
      )}

      <Select
        color='primary-light'
        id={`select-field--${uid}`}
        value={value}
        variant={variant}
        required
        fullWidth
        onChange={handleChange}
        {...rest}
      >
        {choices.map(choice => (
          <MenuItem value={choice} key={choice}>
            {' '}
            {choice}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectSingle
