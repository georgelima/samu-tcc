import React from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { AddCircleOutline, BarChartOutlined, InsertDriveFileOutlined } from '@material-ui/icons'

import { Layout } from '../components/Layout'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to right, #f34e32, #ba3030);
  align-self: center;
  margin: 50px;
  padding: 40px 10px;
  border-radius: 5px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

const Label = styled.span`
  color: white;
  font-size: 1em !important;
  font-family: Roboto, sans-serif;
  margin-top: 20px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`

const Icon = styled.span`
  font-size: 60px;
`

const SECTIONS = [
  { label: 'Cadastrar Atendimento', route: '/novo', icon: <AddCircleOutline nativeColor='white' fontSize='inherit' /> },
  { label: 'Estatísticas', route: '/dashboard', icon: <BarChartOutlined nativeColor='white' fontSize='inherit' /> },
  {
    label: 'Relatórios',
    route: '/relatorio',
    icon: <InsertDriveFileOutlined nativeColor='white' fontSize='inherit' />,
  },
]

export const Startup = (props: RouteComponentProps) => {
  const { history } = props

  return (
    <Layout {...props}>
      <Grid container spacing={16}>
        {SECTIONS.map(({ label, route, icon }) => (
          <Grid item key={`help-desk-${label}-${route}`} sm={12} md={4}>
            <Card onClick={() => history.push(route)}>
              <Icon>{icon}</Icon>
              <Label>{label}</Label>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  )
}
