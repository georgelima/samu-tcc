import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'

import { FormControl, InputLabel, Select as MaterialSelect, OutlinedInput } from '@material-ui/core'

type Props = {
  label: string
  name: string
  value: string
  handleChange: (name: string, value: string) => void
  options: { label: string; value: string }[]
}

type State = {
  labelWidth: number
}

export class Select extends PureComponent<Props, State> {
  inputLabelRef: InputLabel | null

  state = {
    labelWidth: 0,
  }

  constructor(props: Props) {
    super(props)
    this.inputLabelRef = null
  }

  componentDidMount() {
    const label = ReactDOM.findDOMNode(this.inputLabelRef)
    // @ts-ignore
    const labelWidth = label ? label.offsetWidth : 0

    this.setState({
      labelWidth,
    })
  }

  render() {
    const { name, label, value, handleChange, options } = this.props
    const { labelWidth } = this.state

    return (
      <FormControl variant="outlined" fullWidth>
        <InputLabel
          ref={ref => {
            this.inputLabelRef = ref
          }}
        >
          {label}
        </InputLabel>
        <MaterialSelect
          fullWidth
          native
          name={name}
          value={value}
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
  }
}
