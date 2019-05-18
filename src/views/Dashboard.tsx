import React, { PureComponent } from 'react'

import { Grid, Typography } from '@material-ui/core'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  Label,
} from 'recharts'

import { RouteComponentProps } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { Box } from '../components/Box'
import { Query } from '../components/Query'
import { ErrorComponent } from '../components/Error'
import { NoData } from '../components/NoData'
import { FullLoader } from '../components/FullLoader'

import { TRAUMA_MECHANISM } from './InsertMedicalRecord'

import { getAnalytics } from '../services/api'

type State = {
  value: { [key: string]: any }
}

const COLORS = ['#0088FE', '#F00', '#FFBB28']

export class Dashboard extends PureComponent<RouteComponentProps, State> {
  state = {
    value: {},
  }

  render() {
    return (
      <Layout {...this.props}>
        <Query method={getAnalytics}>
          {({ isLoading, data, error }) =>
            isLoading ? (
              <FullLoader />
            ) : error || !data ? (
              <ErrorComponent message={(error && error.message) || 'Algo deu errado'} />
            ) : (
              <Grid container spacing={16}>
                <Grid item xs={12}>
                  <Box title='Frequência de Ocorrências' subtitle='Últimos 30 dias'>
                    {Object.keys(data.frequency).length === 0 ? (
                      <Typography variant='caption' color='primary'>
                        Sem ocorrências nos últimos 30 dias
                      </Typography>
                    ) : (
                      <ResponsiveContainer height={200} width='100%'>
                        <LineChart
                          data={Object.keys(data.frequency).map(key => ({
                            name: key,
                            frequency: data.frequency[key],
                          }))}
                        >
                          <XAxis dataKey='name' />
                          <YAxis scale='ordinal' />
                          <Line type='monotone' dataKey='frequency' strokeWidth={2} />
                          <Tooltip formatter={value => [value, 'Ocorrências']} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box title='Frequência de Ocorrências por Sexo' subtitle=''>
                    <ResponsiveContainer height={350} width='100%'>
                      <PieChart>
                        <Pie
                          dataKey='value'
                          isAnimationActive
                          data={[
                            { value: data.frequencyByGender['M'], name: 'Homens' },
                            { value: data.frequencyByGender['F'], name: 'Mulheres' },
                            { value: data.frequencyByGender['U'], name: 'Não informado' },
                          ]}
                          innerRadius={60}
                          outerRadius={80}
                          fill='#F00'
                          label
                          paddingAngle={5}
                        >
                          <Cell fill={COLORS[0]} />
                          <Cell fill={COLORS[1]} />
                          <Cell fill={COLORS[2]} />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box title='Frequência de Ocorrências por Idade' subtitle=''>
                    {Object.keys(data.frequencyByAge).length > 0 ? (
                      <ResponsiveContainer height={350} width='100%'>
                        <BarChart
                          data={Object.keys(data.frequencyByAge).map(key => ({
                            name: key.replace(' ', ''),
                            value: data.frequencyByAge[key],
                          }))}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='name' />
                          <YAxis />
                          <Tooltip
                            separator=''
                            formatter={(value, name, elem) => {
                              return [
                                `${value} ${
                                  value > 1 ? 'ocorrências' : 'ocorrência'
                                } nessa faixa etária`,
                              ]
                            }}
                          />
                          <Bar dataKey='value' fill='#8884d8' />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <NoData />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box title='Frequência de Ocorrências por Mecanismo do Trauma' subtitle=''>
                    <ResponsiveContainer height={350} width='100%'>
                      <RadialBarChart
                        innerRadius={20}
                        outerRadius={140}
                        barSize={50}
                        data={[
                          {
                            name: 'Acidente de Trânsito',
                            value:
                              data.frequencyByTraumaMechanism[TRAUMA_MECHANISM.TRAFFIC_ACCIDENT],
                            fill: '#8884d8',
                          },
                          {
                            name: 'Encravamento',
                            value: data.frequencyByTraumaMechanism[TRAUMA_MECHANISM.INTERLOCKING],
                            fill: '#83a6ed',
                          },
                          {
                            name: 'Queda própria altura',
                            value:
                              data.frequencyByTraumaMechanism[TRAUMA_MECHANISM.FALL_OWN_HEIGHT],
                            fill: '#8dd1e1',
                          },
                          {
                            name: 'Queda',
                            value: data.frequencyByTraumaMechanism[TRAUMA_MECHANISM.FALL],
                            fill: '#82ca9d',
                          },
                          {
                            name: 'FAB',
                            value: data.frequencyByTraumaMechanism[TRAUMA_MECHANISM.FAB],
                            fill: '#a4de6c',
                          },
                          {
                            name: 'FPAF',
                            value: data.frequencyByTraumaMechanism[TRAUMA_MECHANISM.FPAF],
                            fill: '#d0ed57',
                          },
                          {
                            name: 'Queimadura',
                            value: data.frequencyByTraumaMechanism[TRAUMA_MECHANISM.BURN],
                            fill: '#ffc658',
                          },
                          {
                            name: 'Agressão',
                            value: data.frequencyByTraumaMechanism[TRAUMA_MECHANISM.AGGRESSION],
                            fill: '#0F0',
                          },
                        ]}
                      >
                        <RadialBar
                          label={{ position: 'insideStart', fill: '#666' }}
                          background
                          dataKey='value'
                        />
                        <Legend />
                        <Tooltip
                          separator=''
                          formatter={(value, name, elem) => {
                            return [
                              `${value} ${value > 1 ? 'ocorrências' : 'ocorrência'} por ${
                                elem.payload.name
                              }`,
                            ]
                          }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
              </Grid>
            )
          }
        </Query>
      </Layout>
    )
  }
}
