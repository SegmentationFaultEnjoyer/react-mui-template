import './SelectedFile.scss'

import { IconButton } from '@mui/material'
import { FC } from 'react'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import { formatFileSize } from '@/helpers'

interface SelectedFileProps {
  file: File
  clearInput: (name: string) => void
}

const SelectedFile: FC<SelectedFileProps> = ({ file, clearInput }) => {
  return (
    <div className='selected-file'>
      <div className='selected-file__wrapper'>
        <img
          className='selected-file__preview'
          src={URL.createObjectURL(file)}
          alt={file.name}
        />
        <section className='selected-file__info'>
          <p className='selected-file__info-name'>{file.name}</p>
          <p className='selected-file__info-size'>
            {formatFileSize(file.size)}
          </p>
        </section>
      </div>

      <div className='selected-file__clear'>
        <IconButton onClick={() => clearInput(file.name)} color='primary-light'>
          <Icon
            className='selected-file__clear-icon'
            name={ICON_NAMES.remove}
          />
        </IconButton>
      </div>
    </div>
  )
}

export default SelectedFile
