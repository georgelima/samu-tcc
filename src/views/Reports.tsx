import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Layout } from '../components/Layout'

export class Reports extends React.PureComponent<RouteComponentProps> {
  render() {
    return (
      <Layout {...this.props}>
        <div />
      </Layout>
    )
  }
}
