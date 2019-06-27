import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { FormControl, InputLabel, Select as MaterialSelect, OutlinedInput } from '@material-ui/core'

type Props = {
  label: string
  name: string
  value: string
  handleChange: (name: string, value: string) => void
  options: { label: string; value: string }[]
  disabled?: boolean
}

export const Select = React.memo(({ name, label, value, handleChange, options, disabled }: Props) => {
  const [labelWidth, setLabelWidth] = useState(0)
  const inputLabelRef: { current: InputLabel | null } = useRef(null)

  useEffect(() => {
    const label = ReactDOM.findDOMNode(inputLabelRef && inputLabelRef.current)
    // @ts-ignore
    const labelWidth = label ? label.offsetWidth : 0

    setLabelWidth(labelWidth)
  }, [])

  return (
    <FormControl variant='outlined' fullWidth>
      <InputLabel
        ref={ref => {
          inputLabelRef.current = ref
        }}
      >
        {label}
      </InputLabel>
      <MaterialSelect
        disabled={disabled}
        fullWidth
        native
        name={name}
        value={value}
        defaultValue={value}
        onChange={event => handleChange(name, event.target.value)}
        input={<OutlinedInput fullWidth name={name} labelWidth={labelWidth} />}
      >
        {options.map(({ label: optionLabel, value: optionValue }) => (
          <option key={`select-${name}-${optionValue}`} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </MaterialSelect>
    </FormControl>
  )
})
