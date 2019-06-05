import React from 'react'

import { Paper, Tabs as MuiTabs, Tab } from '@material-ui/core'

type Props = {
  tabs: Array<{ label: string; children: React.ReactNode }>
}

type State = {
  index: number
}

export class Tabs extends React.PureComponent<Props> {
  state = {
    value: 0,
  }

  handleChange = (value: number) => {
    this.setState({ value })
  }

  renderChildren = () => {
    const child = this.props.tabs[this.state.value]

    return child ? child.children : null
  }

  render() {
    return (
      <Paper>
        <MuiTabs value={this.state.value} onChange={(event, value) => this.handleChange(value)}>
          {this.props.tabs.map(({ label }) => (
            <Tab label={label} />
          ))}
        </MuiTabs>
        {this.renderChildren()}
      </Paper>
    )
  }
}
