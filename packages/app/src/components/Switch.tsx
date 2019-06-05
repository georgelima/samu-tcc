import React from 'react'
import { FormControlLabel, Switch as MuiSwitch } from '@material-ui/core'

type Props = {
  name: string
  label: string
  value: boolean
  handleChange: (name: string, value: boolean) => void
}

export const Switch = ({ name, label, value, handleChange }: Props) => {
  return (
    <FormControlLabel
      label={label}
      control={<MuiSwitch checked={value} onChange={evt => handleChange(name, !value)} />}
    />
  )
}
