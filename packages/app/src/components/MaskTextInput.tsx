import React from 'react'
// @ts-ignore
import VMask from 'vanilla-masker'

import { TextInput, Props as TextInputProps } from './TextInput'

type Props = TextInputProps & { mask: string }

export const MaskTextInput = (args: Props) => {
  return (
    <TextInput {...args} handleChange={(name, value) => args.handleChange(name, VMask.toPattern(value, args.mask))} />
  )
}
