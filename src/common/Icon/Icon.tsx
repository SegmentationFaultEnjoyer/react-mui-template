import './style.scss'

import { SvgIcon } from '@mui/material'
import { FC, HTMLAttributes } from 'react'

import { ICON_NAMES } from '@/enums'

interface IconProps extends HTMLAttributes<HTMLOrSVGElement> {
  name: ICON_NAMES
}

const Icon: FC<IconProps> = ({ name, className = '', ...rest }) => {
  return (
    <SvgIcon className={`icon ${className}`} aria-hidden='true'>
      <use href={`#${name}-icon`} {...rest} />
    </SvgIcon>
  )
}

export default Icon
