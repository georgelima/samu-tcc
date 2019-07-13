import React from 'react'
import { TextField, InputAdornment } from '@material-ui/core'
import { FormikErrors } from 'formik'
// @ts-ignore
import VMask from 'vanilla-masker'

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
  mask?: string
  margin?: 'none' | 'dense' | 'normal'
}

type State = {
  value: string
}

export class TextInput extends React.Component<Props, State> {
  state = {
    value: '',
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      value: props.value,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.value !== nextProps.value ||
      (this.props.errors || []).length !== (nextProps.errors || []).length ||
      this.state.value !== nextState.value
    )
  }

  componentDidUpdate(prevProps:Props) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value
      })
    }
  }

  render() {
    const {
      name,
      label,
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
      mask,
      margin,
    } = this.props

    const { value } = this.state

    const hasError = Boolean(errors && errors[name])

    return (
      <TextField
        margin={margin}
        name={name}
        variant="outlined"
        label={label}
        value={value}
        onChange={event =>
          this.setState({ value: mask ? VMask.toPattern(event.target.value, mask) : event.target.value })
        }
        onBlur={() => handleChange(name, value)}
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
          startAdornment: startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : null,
          endAdornment: endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : null,
        }}
        className={className}
      />
    )
  }
}
