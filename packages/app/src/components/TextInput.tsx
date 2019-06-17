import React from 'react'
import { TextField, InputAdornment } from '@material-ui/core'
import { FormikErrors } from 'formik'

export type Props = {
  name: string
  label: string
  value: string
  handleChange: (name: string, value: string) => void
  helperText?: string
  errors?: FormikErrors<{ [k: string]: any }>
  placeholder?: string
  type?: string
  multiline?: boolean
  rows?: number
  style?: object
  startAdornment?: React.ReactElement
  endAdornment?: React.ReactElement
  className?: string
}

export const TextInput = ({
  name,
  label,
  value,
  handleChange,
  helperText,
  errors,
  placeholder,
  type,
  multiline,
  rows,
  style,
  startAdornment,
  endAdornment,
  className,
}: Props) => {
  const hasError = Boolean(errors && errors[name])

  return (
    <TextField
      name={name}
      variant='outlined'
      label={label}
      value={value}
      onChange={event => handleChange(name, event.target.value)}
      helperText={hasError ? `O campo ${label} é obrigatório` : helperText}
      fullWidth
      error={hasError}
      placeholder={placeholder}
      type={type}
      multiline={multiline}
      rows={rows}
      style={style}
      InputProps={{
        style: {
          boxSizing: 'border-box',
        },
        startAdornment: startAdornment ? <InputAdornment position='start'>{startAdornment}</InputAdornment> : null,
        endAdornment: endAdornment ? <InputAdornment position='end'>{endAdornment}</InputAdornment> : null,
      }}
      className={className}
    />
  )
}
