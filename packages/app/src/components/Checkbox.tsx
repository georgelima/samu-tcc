import React from 'react'

import { FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core'

type Props = {
  name: string
  label: string
  value?: string
  checked: boolean
  handleChange: (name: string, value: string) => void
  extraData?: any | null
  uncontrolled?: boolean
}

type State = {
  checked: boolean
}

export class Checkbox extends React.Component<Props> {
  state = {
    checked: false,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      checked: props.checked,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.checked !== nextProps.checked ||
      this.props.value !== nextProps.value ||
      this.props.extraData !== nextProps.extraData ||
      this.state.checked !== nextState.checked
    )
  }

  render() {
    const { name, label, checked, value, handleChange, uncontrolled } = this.props
    const { checked: stateChecked } = this.state

    return (
      <FormControlLabel
        control={
          <MuiCheckbox
            checked={uncontrolled ? stateChecked : checked}
            onChange={event => {
              handleChange(name, event.target.value)

              if (uncontrolled) {
                this.setState({
                  checked: !stateChecked,
                })
              }
            }}
            value={value}
          />
        }
        label={label}
      />
    )
  }
}
