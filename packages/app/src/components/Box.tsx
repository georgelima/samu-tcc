import React from 'react'

import { Card, CardHeader, CardMedia, CardContent, CardActions } from '@material-ui/core'

type Props = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export const Box = ({ title, subtitle, children }: Props) => (
  <Card>
    <CardHeader title={title} subheader={subtitle} />
    <CardContent>{children}</CardContent>
  </Card>
)
