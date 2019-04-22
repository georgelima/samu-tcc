import React from 'react'
import { TextField } from '@material-ui/core'
import { FormikErrors } from 'formik'

export type Props = {
  name: string
  label: string
  value: string
  handleChange: (name: string, value: string) => void
  helperText?: string
  errors: FormikErrors<{ [k: string]: any }>
  placeholder?: string
  type?: string
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
}: Props) => {
  const hasError = Boolean(errors[name])

  return (
    <TextField
      name={name}
      variant="outlined"
      label={label}
      value={value}
      onChange={event => handleChange(name, event.target.value)}
      helperText={hasError ? errors[name] : helperText}
      fullWidth
      error={hasError}
      placeholder={placeholder}
      type={type}
    />
  )
}
