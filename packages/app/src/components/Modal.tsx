import React, { useState } from 'react'

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'

export const Modal = ({ title, children, description = '', trigger }) => {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <>
      <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        {/* <DialogContent style={{ minWidth: '500px' }}> */}
        <DialogContentText>{description}</DialogContentText>
        {children({ close })}
        {/* </DialogContent> */}
      </Dialog>

      {trigger({ open: () => setOpen(true) })}
    </>
  )
}
