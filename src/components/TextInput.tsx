import React from 'react'
import { TextField } from '@material-ui/core'
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
}

export class TextInput extends React.PureComponent<Props> {
  render() {
    const {
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
    } = this.props

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
      />
    )
  }
}
