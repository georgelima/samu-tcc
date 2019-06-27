import React from 'react'

import { FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core'

type Props = {
  name: string
  label: string
  value?: string
  checked: boolean
  handleChange: (name: string, value: string) => void
  extraData?: any | null
}

export class Checkbox extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      this.props.checked !== nextProps.checked ||
      this.props.value !== nextProps.value ||
      this.props.extraData !== nextProps.extraData
    )
  }

  render() {
    const { name, label, checked, value, handleChange } = this.props

    return (
      <FormControlLabel
        control={
          <MuiCheckbox checked={checked} onChange={event => handleChange(name, event.target.value)} value={value} />
        }
        label={label}
      />
    )
  }
}
