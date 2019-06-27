import React, { useState, memo } from 'react'

import { Paper, Tabs as MuiTabs, Tab } from '@material-ui/core'

type Props = {
  tabs: Array<{ label: string; children: React.ReactNode }>
}

export const Tabs = memo(({ tabs }: Props) => {
  const [value, setValue] = useState(0)
  const child = tabs[value]

  return (
    <Paper>
      <MuiTabs value={value} onChange={(event, value) => setValue(value)}>
        {tabs.map(({ label }) => (
          <Tab label={label} />
        ))}
      </MuiTabs>
      {child ? child.children : null}
    </Paper>
  )
})
