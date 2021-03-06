import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Document, Page, View, Text, PDFViewer, Font, StyleSheet } from '@react-pdf/renderer'
import { Grid, Button, Snackbar } from '@material-ui/core'
import * as dateFns from 'date-fns'

import { Layout } from '../components/Layout'
import { TextInput } from '../components/TextInput'
import { Select } from '../components/Select'

import { generateReport } from '../services/api'

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  titleWrapper: {
    width: '100%',
    backgroundColor: '#d1d1d1',
    padding: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
    marginTop: 5,
  },
  subTitleWrapper: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    padding: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
  },
  subTitleChildren: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    padding: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 11,
  },
  key: {
    color: 'black',
  },
  value: {
    color: 'black',
    fontWeight: 'bold',
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Open Sans',
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  disclaimer: {
    position: 'absolute',
    fontSize: 8,
    bottom: 5,
    right: 5,
    textAlign: 'right',
    color: 'grey',
  },
})

Font.register({
  family: 'Open Sans',
  // @ts-ignore
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-800.ttf',
      fontWeight: 'bold',
    },
  ],
})

const DATE_INTERVALS = [
  { label: 'Semana', value: 'week' },
  { label: 'Mês', value: 'month' },
  { label: 'Ano', value: 'year' },
  { label: 'Todo Período', value: 'all' },
]

const toPercent = (value: number, total: number) => ((value / total) * 100).toFixed(2)

type State = {
  from: string
  to: string
  showSnackbar: boolean
  dateInterval: string
  isSubmitting: boolean
  data: { [x: string]: any } | null
  message: string | null
}

const formatDate = (date: Date) => dateFns.format(date, 'DD/MM/YYYY')

const renderValue = (value: any, total: number) => {
  return (
    <Text style={styles.value}>
      {value} ({toPercent(value, total)} %)
    </Text>
  )
}

export const Reports = (props: RouteComponentProps) => {
  const [range, setRange] = useState<{ from: string | null; to: string | null }>({
    from: dateFns.format(dateFns.startOfMonth(new Date()), 'DD/MM/YYYY'),
    to: dateFns.format(dateFns.endOfMonth(new Date()), 'DD/MM/YYYY'),
  })
  const [showSnackbar, setShowSnackbar] = useState(false)
  const [dateInterval, setDateInterval] = useState('month')
  const [isSubmitting, setSubmitting] = useState(false)
  // @ts-ignore
  const [data, setData]: [{ [x: string]: any }, Function] = useState(null)
  const [message, setMessage] = useState('')

  return (
    <Layout {...props}>
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={showSnackbar}
          autoHideDuration={4000}
          onClose={() => {
            setShowSnackbar(false)
            setMessage('')
          }}
          message={message}
        />
        <Grid container spacing={16} style={{ marginTop: 20, marginBottom: 10 }}>
          <Grid item xs={12} sm={3}>
            <Select
              label='Escolha o período'
              name='dateInterval'
              value={dateInterval}
              handleChange={(name, value) => {
                const today = new Date()

                setDateInterval(value)

                if (value === 'week') {
                  return setRange({
                    from: formatDate(dateFns.startOfWeek(today)),
                    to: formatDate(dateFns.endOfWeek(today)),
                  })
                }

                if (value === 'month') {
                  return setRange({
                    from: formatDate(dateFns.startOfMonth(today)),
                    to: formatDate(dateFns.endOfMonth(today)),
                  })
                }

                if (value === 'year') {
                  return setRange({
                    from: formatDate(dateFns.startOfYear(today)),
                    to: formatDate(dateFns.endOfYear(today)),
                  })
                }

                setRange({
                  from: null,
                  to: null,
                })
              }}
              options={DATE_INTERVALS}
            />
          </Grid>
          {dateInterval !== 'all' && (
            <>
              <Grid item xs={12} sm={3}>
                <TextInput
                  name='from'
                  label='Data Início'
                  placeholder='DD/MM/YYYY'
                  value={String(range.from)}
                  handleChange={(name, value) => setRange({ ...range, from: value })}
                  mask='99/99/9999'
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  name='to'
                  label='Data Fim'
                  placeholder='DD/MM/YYYY'
                  value={String(range.to)}
                  handleChange={(name, value) => setRange({ ...range, to: value })}
                  mask='99/99/9999'
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={3}>
            <Button
              type='submit'
              fullWidth
              variant='outlined'
              onClick={() => {
                setSubmitting(true)
                setData(null)

                generateReport({ from: range.from ? String(range.from) : null, to: range.to ? String(range.to) : null })
                  .then(data => setData(new Object(data)))
                  .catch(err => {
                    setSubmitting(false)
                    setShowSnackbar(true)
                    setMessage('Algo deu errado! Por favor tente novamente mais tarde!')
                  })
              }}
              style={{ paddingTop: 15, paddingBottom: 15 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Aguarde...' : 'Gerar'}
            </Button>
          </Grid>
        </Grid>
        {data ? (
          <PDFViewer width='100%' style={{ height: 'calc(100vh - 100px)' }}>
            <Document
              onRender={() => {
                setSubmitting(false)
                setShowSnackbar(true)
                setMessage('Relatório gerado com sucesso!')
              }}
            >
              <Page style={styles.body}>
                <Text style={styles.header}>Relatório de Atendimentos - SAMU</Text>
                <Text style={styles.subheader}>
                  Período: {data.from} - {data.to}
                </Text>
                <Text style={styles.sectionTitle}>Dados Gerais</Text>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>1 - TOTAL DE ATENDIMENTOS</Text>
                  <Text style={styles.value}>{data.total}</Text>
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>2 - TOTAL DE ATENDIMENTO POR CAUSAS</Text>
                  <Text style={styles.value}>{data.total}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>2.1 - CLÍNICA</Text>
                  <Text style={styles.value}>{renderValue(data.recordsByRequestReason.clinical, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>2.2 - CIRÚRGICA</Text>
                  <Text style={styles.value}>{renderValue(data.recordsByRequestReason.surgical, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>2.3 - OBSTÉTRICA</Text>
                  <Text style={styles.value}>{renderValue(data.recordsByRequestReason.obstetric, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>2.4 - PSIQUIÁTRICA</Text>
                  <Text style={styles.value}>{renderValue(data.recordsByRequestReason.psychiatric, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>2.5 - PEDIÁTRICA</Text>
                  <Text style={styles.value}>{renderValue(data.recordsByRequestReason.pediatric, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>2.6 - TRANSPORTE INTER-HOSPITALAR</Text>
                  <Text style={styles.value}>
                    {renderValue(data.recordsByRequestReason.interhospitalTransport, data.total)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>2.7 - OUTROS</Text>
                  <Text style={styles.value}>{renderValue(data.recordsByRequestReason.other, data.total)}</Text>
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>3 - TOTAL DE ATENDIMENTO POR FAIXA ETÁRIA</Text>
                  <Text style={styles.value}>{data.total}</Text>
                </View>

                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>3.1 - IDADE DE 0 A 14 ANOS</Text>
                  <Text style={styles.value}>{renderValue(data.ageGroup['0 - 14'], data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>3.2 - IDADE DE 15 A 24 ANOS</Text>
                  <Text style={styles.value}>{renderValue(data.ageGroup['15 - 24'], data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>3.3 - IDADE DE 25 A 50 ANOS</Text>
                  <Text style={styles.value}>{renderValue(data.ageGroup['25 - 50'], data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>3.4 - IDADE DE 51 A 64 ANOS</Text>
                  <Text style={styles.value}>{renderValue(data.ageGroup['51 - 64'], data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>3.5 - ACIMA DE 65 ANOS</Text>
                  <Text style={styles.value}>{renderValue(data.ageGroup['65 +'], data.total)}</Text>
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>4 - TOTAL DE ATENDIMENTO POR SEXO</Text>
                  <Text style={styles.value}> {data.gender.male + data.gender.female} </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>4.1 - MASCULINO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.gender.male, data.gender.male + data.gender.female)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>4.2 - FEMININO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.gender.female, data.gender.male + data.gender.female)}
                  </Text>
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>5 - TOTAL DE ATENDIMENTO POR MECANISMO DO TRAUMA</Text>
                  <Text style={styles.value}>{data.total}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>5.1 - ACIDENTE DE TRÂNSITO</Text>
                  <Text style={styles.value}>{renderValue(data.traumaMechanism.trafficAccident, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>5.2 - ENCRAVAMENTO</Text>
                  <Text style={styles.value}>{renderValue(data.traumaMechanism.interlocking, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>5.3 - QUEDA PRÓPRIA ALTURA</Text>
                  <Text style={styles.value}>{renderValue(data.traumaMechanism.fallOwnHeight, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>5.4 - QUEDA</Text>
                  <Text style={styles.value}>{renderValue(data.traumaMechanism.fall, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>5.5 - FERIMENTO POR ARMA BRANCA</Text>
                  <Text style={styles.value}>{renderValue(data.traumaMechanism.fab, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>5.6 - FERIMENTO POR PROJÉTIL DE ARMA DE FOGO</Text>
                  <Text style={styles.value}>{renderValue(data.traumaMechanism.fpaf, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>5.7 - QUEIMADURA</Text>
                  <Text style={styles.value}>{renderValue(data.traumaMechanism.burn, data.total)}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>5.8 - AGRESSÃO</Text>
                  <Text style={styles.value}>{renderValue(data.traumaMechanism.aggression, data.total)}</Text>
                </View>
                <Text style={styles.sectionTitle}>Acidentes de Trânsito</Text>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>6 - TOTAL DE OCORRÊNCIAS</Text>
                  <Text style={styles.value}>{data.traumaMechanism.trafficAccident}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>6.1 - INDÍCIO DE BEBIDA ALCÓOLICA</Text>
                  <Text style={styles.value}>
                    {renderValue(data.ethylBreath, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>7 - TOTAL DE OCORRÊNCIAS POR TIPO DE ACIDENTE</Text>
                  <Text style={styles.value}>{data.traumaMechanism.trafficAccident}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>7.1 - ATROPELAMENTO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.trafficAccidentByOccurrenceType.trampling, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>7.2 - FRONTAL</Text>
                  <Text style={styles.value}>
                    {renderValue(data.trafficAccidentByOccurrenceType.front, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>7.3 - LATERAL</Text>
                  <Text style={styles.value}>
                    {renderValue(data.trafficAccidentByOccurrenceType.side, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>7.4 - TRASEIRO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.trafficAccidentByOccurrenceType.rear, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>7.5 - CAPOTAMENTO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.trafficAccidentByOccurrenceType.rollover, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>7.6 - ROTACIONAL</Text>
                  <Text style={styles.value}>
                    {renderValue(data.trafficAccidentByOccurrenceType.rotational, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>8 - TOTAL DE OCORRÊNCIAS POR MEIO DE LOCOMOÇÃO DA VÍTIMA</Text>
                  <Text style={styles.value}>{data.traumaMechanism.trafficAccident}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>8.1 - CARRO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.victimVehicle.car, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>8.2 - MOTO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.victimVehicle.motorcycle, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>8.3 - CAMINHÃO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.victimVehicle.truck, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>8.4 - ÔNIBUS</Text>
                  <Text style={styles.value}>
                    {renderValue(data.victimVehicle.bus, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>8.5 - VAN</Text>
                  <Text style={styles.value}>
                    {renderValue(data.victimVehicle.van, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>8.6 - BICICLETA</Text>
                  <Text style={styles.value}>
                    {renderValue(data.victimVehicle.bike, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>8.7 - SEM INFORMACÃO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.victimVehicle.noInformation, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>
                    9 - TOTAL DE OCORRÊNCIAS POR MEIO DE LOCOMOÇÃO DA OUTRA PARTE ENVOLVIDA
                  </Text>
                  <Text style={styles.value}>{data.traumaMechanism.trafficAccident}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.1 - CARRO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.car, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.2 - MOTO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.motorcycle, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.3 - CAMINHÃO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.truck, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.4 - ÔNIBUS</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.bus, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.5 - VAN</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.van, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.6 - BICICLETA</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.bike, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.7 - PEDESTRE</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.pedestrian, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.8 - SEM INFORMACÃO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.noInformation, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>9.9 - MURO/POSTE/ÁRVORE</Text>
                  <Text style={styles.value}>
                    {renderValue(data.otherInvolvedVehicle.wallLampostTree, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.titleWrapper}>
                  <Text style={styles.key}>10 - TOTAL DE OCORRÊNCIAS POR EQUIPAMENTO DE SEGURANÇA</Text>
                  <Text style={styles.value}>{data.traumaMechanism.trafficAccident}</Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>10.1 - NÃO USAVA</Text>
                  <Text style={styles.value}>
                    {renderValue(data.safetyEquipment.none, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>10.2 - CINTO DE 2 OU 3 PONTOS</Text>
                  <Text style={styles.value}>
                    {renderValue(data.safetyEquipment.twoOrThreePointBelt, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>10.3 - CAPACETE RETIRADO PELA EQUIPE</Text>
                  <Text style={styles.value}>
                    {renderValue(data.safetyEquipment.helmetTakenByTeam, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>10.4 - CAPACETE RETIRADO POR OUTROS</Text>
                  <Text style={styles.value}>
                    {renderValue(data.safetyEquipment.helmetTakenByOthers, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>
                <View style={styles.subTitleWrapper}>
                  <Text style={styles.key}>10.5 - SEM INFORMACÃO</Text>
                  <Text style={styles.value}>
                    {renderValue(data.safetyEquipment.noInformation, data.traumaMechanism.trafficAccident)}
                  </Text>
                </View>

                <Text
                  style={styles.pageNumber}
                  render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                  fixed
                />
                <Text
                  style={styles.disclaimer}
                  render={({ pageNumber, totalPages }) =>
                    `Gerado em ${dateFns.format(new Date(), 'DD/MM/YYYY HH:MM:SS')}`
                  }
                  fixed
                />
              </Page>
            </Document>
          </PDFViewer>
        ) : null}
      </>
    </Layout>
  )
}
