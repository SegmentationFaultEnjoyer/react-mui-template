import './FileField.scss'

import { Add as AddIcon } from '@mui/icons-material'
import { Button } from '@mui/material'
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useMemo,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDrop } from 'react-use'
import { v4 as uuid } from 'uuid'

import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import SelectedFile from '@/fields/FileField/SelectedFile'
import { Bus, formatFileSize } from '@/helpers'

const DEFAULT_MIME_TYPES = [
  'image/jpg',
  'image/png',
  'image/jpeg',
  'image/webp',
]

const DEFAULT_MAX_SIZE = 5242880 // bytes  5 mb
const DEFAULT_ACCEPT = 'image/*'

interface Props {
  files: File[]
  setFiles: Dispatch<SetStateAction<File[]>>
  label?: string
  subtitle?: string
  maxSize?: number
  mimeTypes?: Array<string>
  accept?: string
}

const FileField: FC<Props> = ({
  files,
  setFiles,
  label,
  subtitle,
  maxSize = DEFAULT_MAX_SIZE,
  mimeTypes = DEFAULT_MIME_TYPES,
  accept = DEFAULT_ACCEPT,
}) => {
  const { t } = useTranslation()

  const dropZoneState = useDrop({
    onFiles: files => {
      processSelectedFiles(files)
    },
  })

  const uid = uuid()

  const inputRef = useRef<HTMLInputElement | null>(null)

  const fileFieldClasses = useMemo(() => {
    const defaultClasses = ['file-field__wrapper']

    if (files.length) defaultClasses.push('file-field__wrapper--hidden')

    if (dropZoneState.over) defaultClasses.push('file-field__wrapper--active')

    return defaultClasses.join(' ')
  }, [dropZoneState, files])

  const validateFile = (file: File) => {
    // MIME TYPE validation
    if (!mimeTypes.includes(file.type)) {
      Bus.warning(`File type "${file.type}" is not supported.`)
      return false
    }

    // SIZE Validation
    if (file.size > maxSize) {
      Bus.warning(
        `File ${file.name}'s size exceeds ${formatFileSize(maxSize)}.`,
      )
      return false
    }

    // SAME files check
    if (files.some(_file => _file.name === file.name)) return false

    return true
  }

  const processSelectedFiles = (fileList: File[]) => {
    const validFiles: File[] = []

    for (const file of fileList) {
      const isValid = validateFile(file)

      if (!isValid) continue

      validFiles.push(file)
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles])
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target.files || event.target.files.length < 1) return

    processSelectedFiles(Array.from(event.target.files))
  }

  const clearInput = (name: string) => {
    setFiles(prev => prev.filter(file => file.name !== name))
  }

  return (
    <div className='file-field'>
      {label && (
        <label htmlFor={`file-field--${uid}`} className='file-field__label'>
          {label}
        </label>
      )}
      <button
        className={fileFieldClasses}
        onClick={() => inputRef.current?.click()}
      >
        <input
          id={`file-field--${uid}`}
          ref={inputRef}
          hidden
          accept={accept}
          type='file'
          multiple
          onChange={handleFileChange}
        />
        <Icon className='file-field__upload-icon' name={ICON_NAMES.upload} />
        <p className='file-field__title'>{t('file-field.title')}</p>
        {subtitle && <p className='file-field__sublabel'>{subtitle}</p>}
      </button>

      {Boolean(files.length) && (
        <div className='file-field__uploaded-files'>
          {files.map((file, idx) => (
            <SelectedFile key={idx} file={file} clearInput={clearInput} />
          ))}
          <Button
            className='file-field__add-btn'
            startIcon={<AddIcon />}
            onClick={() => inputRef.current?.click()}
          >
            {t('file-field.another-file-lbl')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default FileField
