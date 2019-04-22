import React from 'react'

import { FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core'

type Props = {
  name: string
  label: string
  value?: string
  checked: boolean
  handleChange: (name: string, value: string) => void
}

export const Checkbox = ({ name, label, checked, value, handleChange }: Props) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          checked={checked}
          onChange={event => handleChange(name, event.target.value)}
          value={value}
        />
      }
      label={label}
    />
  )
}
