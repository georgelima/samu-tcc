import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Document, Page, View, Text, PDFViewer, Font, StyleSheet } from '@react-pdf/renderer'
import { Grid, Button, Snackbar } from '@material-ui/core'
import * as dateFns from 'date-fns'
import { JSONValue } from 'ky'

import { Layout } from '../components/Layout'
import { MaskTextInput } from '../components/MaskTextInput'
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
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  titleWrapper: {
    width: '100%',
    backgroundColor: '#d1d1d1',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
    marginTop: 5,
  },
  subTitleWrapper: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
  },
  subTitleChildren: {
    width: '100%',
    backgroundColor: '#f4f4f4',
    padding: 5,
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

export class Reports extends React.PureComponent<RouteComponentProps, State> {
  state: State = {
    from: dateFns.format(dateFns.startOfMonth(new Date()), 'DD/MM/YYYY'),
    to: dateFns.format(dateFns.endOfMonth(new Date()), 'DD/MM/YYYY'),
    showSnackbar: false,
    dateInterval: 'month',
    isSubmitting: false,
    data: null,
    message: null,
  }

  formatDate = (date: Date) => dateFns.format(date, 'DD/MM/YYYY')

  handleChange = (name: string, value: string) =>
    // @ts-ignore
    this.setState({
      [name]: value,
    })

  handleChangeInterval = (name: string, value: string) => {
    const today = new Date()

    this.setState({
      dateInterval: value,
    })

    if (value === 'week') {
      return this.setState({
        from: this.formatDate(dateFns.startOfWeek(today)),
        to: this.formatDate(dateFns.endOfWeek(today)),
      })
    }

    if (value === 'month') {
      return this.setState({
        from: this.formatDate(dateFns.startOfMonth(today)),
        to: this.formatDate(dateFns.endOfMonth(today)),
      })
    }

    if (value === 'year') {
      return this.setState({
        from: this.formatDate(dateFns.startOfYear(today)),
        to: this.formatDate(dateFns.endOfYear(today)),
      })
    }
  }

  onSubmit = () => {
    this.setState({
      isSubmitting: true,
    })

    generateReport({ from: this.state.from, to: this.state.to })
      .then(data => {
        this.setState(state => ({
          ...state,
          isSubmitting: false,
          data: new Object(data),
          showSnackbar: true,
          message: 'Relatório gerado com sucesso!',
        }))
      })
      .catch(err => {
        this.setState({
          isSubmitting: false,
          showSnackbar: true,
          message: 'Algo deu errado! Por favor tente novamente mais tarde!',
        })
      })
  }

  renderValue = (value: any, total: number) => {
    return (
      <Text style={styles.value}>
        {value} ({toPercent(value, total)} %)
      </Text>
    )
  }

  render() {
    const { data, message, dateInterval, showSnackbar, from, to, isSubmitting } = this.state

    return (
      <Layout {...this.props}>
        <>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={showSnackbar}
            autoHideDuration={4000}
            onClose={() => this.setState({ showSnackbar: false, message: null })}
            message={message}
          />
          <Grid container spacing={16} style={{ marginTop: 20, marginBottom: 10 }}>
            <Grid item xs={12} sm={3}>
              <Select
                label='Escolha o período'
                name='dateInterval'
                value={dateInterval}
                handleChange={this.handleChangeInterval}
                options={DATE_INTERVALS}
              />
            </Grid>
            {dateInterval !== 'all' && (
              <>
                <Grid item xs={12} sm={3}>
                  <MaskTextInput
                    name='from'
                    label='Data Início'
                    placeholder='DD/MM/YYYY'
                    value={from}
                    handleChange={this.handleChange}
                    mask='99/99/9999'
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <MaskTextInput
                    name='to'
                    label='Data Fim'
                    placeholder='DD/MM/YYYY'
                    value={to}
                    handleChange={this.handleChange}
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
                onClick={this.onSubmit}
                style={{ paddingTop: 15, paddingBottom: 15 }}
                disabled={!from || !to || isSubmitting}
              >
                {isSubmitting ? 'Aguarde...' : 'Gerar'}
              </Button>
            </Grid>
          </Grid>
          {data ? (
            <PDFViewer width='100%' style={{ height: 'calc(100vh - 100px)' }}>
              <Document>
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
                    <Text style={styles.value}>
                      {this.renderValue(data.recordsByRequestReason.clinical, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>2.2 - CIRÚRGICA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.recordsByRequestReason.surgical, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>2.3 - OBSTÉTRICA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.recordsByRequestReason.obstetric, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>2.4 - PSIQUIÁTRICA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.recordsByRequestReason.psychiatric, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>2.5 - PEDIÁTRICA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.recordsByRequestReason.pediatric, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>2.6 - TRANSPORTE INTER-HOSPITALAR</Text>
                    <Text style={styles.value}>
                      {this.renderValue(
                        data.recordsByRequestReason.interhospitalTransport,
                        data.total,
                      )}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>2.7 - OUTROS</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.recordsByRequestReason.other, data.total)}
                    </Text>
                  </View>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.key}>3 - TOTAL DE ATENDIMENTO POR FAIXA ETÁRIA</Text>
                    <Text style={styles.value}>{data.total}</Text>
                  </View>

                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>3.1 - IDADE DE 0 A 14 ANOS</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.ageGroup['0 - 14'], data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>3.2 - IDADE DE 15 A 24 ANOS</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.ageGroup['15 - 24'], data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>3.3 - IDADE DE 25 A 50 ANOS</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.ageGroup['25 - 50'], data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>3.4 - IDADE DE 51 A 64 ANOS</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.ageGroup['51 - 64'], data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>3.5 - ACIMA DE 65 ANOS</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.ageGroup['65 +'], data.total)}
                    </Text>
                  </View>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.key}>4 - TOTAL DE ATENDIMENTO POR SEXO</Text>
                    <Text style={styles.value}> {data.gender.male + data.gender.female} </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>4.1 - MASCULINO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.gender.male, data.gender.male + data.gender.female)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>4.2 - FEMININO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.gender.female, data.gender.male + data.gender.female)}
                    </Text>
                  </View>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.key}>5 - TOTAL DE ATENDIMENTO POR MECANISMO DO TRAUMA</Text>
                    <Text style={styles.value}>{data.total}</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>5.1 - ACIDENTE DE TRÂNSITO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.traumaMechanism.trafficAccident, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>5.2 - ENCRAVAMENTO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.traumaMechanism.interlocking, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>5.3 - QUEDA PRÓPRIA ALTURA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.traumaMechanism.fallOwnHeight, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>5.4 - QUEDA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.traumaMechanism.fall, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>5.5 - FERIMENTO POR ARMA BRANCA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.traumaMechanism.fab, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>5.6 - FERIMENTO POR PROJÉTIL DE ARMA DE FOGO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.traumaMechanism.fpaf, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>5.7 - QUEIMADURA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.traumaMechanism.burn, data.total)}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>5.8 - AGRESSÃO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.traumaMechanism.aggression, data.total)}
                    </Text>
                  </View>
                  {/* <div>
          a) loc_oco – município de localidade da ocorrência; <br />
          b) id – idade da vítima;
          <br />
          c) idh - Índice de Desenvolvimento Humano do município na época do estudo;
          <br />
          d) sanea - percentual de domicílios com saneamento básico na área (bairro) em estudo;
          <br />
          e) sex – sexo da vítima;
          <br />
          f) beb_alc – indício de bebida alcoolica;
          <br />
          g) tip_oco – tipo de ocorrência de acidente;
          <br />
          h) vit - vítima;
          <br />
          i) mei_loc – meio de locomoção da vítima;
          <br />
          j) mei_locO – meio de locomoção da outra parte envolvida;
          <br />
          k) Equ_seg – equipamento de segurança;
          <br />
          l) gla - glasgow;
          <br />
          m) res_ver – resposta verbal;
          <br />
          n) res_mot – resposta motora;
          <br />
          o) pup – pupila;
          <br />
          p) dor – escala de dor
          <br />
          q) pul – pulso
          <br />
          r) san – sangramento;
          <br />
          s) fra - fratura;
          <br />
          t) pro_rea – procedimento realizado;
          <br />
          u) óbt – óbito.
          <br /> */}
                  <Text style={styles.sectionTitle}>Acidentes de Trânsito</Text>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.key}>6 - TOTAL DE OCORRÊNCIAS</Text>
                    <Text style={styles.value}>{data.traumaMechanism.trafficAccident}</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>6.1 - INDÍCIO DE BEBIDA ALCÓOLICA</Text>
                    <Text style={styles.value}>
                      {this.renderValue(data.ethylBreath, data.traumaMechanism.trafficAccident)}
                    </Text>
                  </View>
                  {/* trafficAccidentByOccurrenceType: {
          trampling: trafficAccidentByOccurrenceType.TRAMPLING,
          front: trafficAccidentByOccurrenceType.FRONT,
          side: trafficAccidentByOccurrenceType.SIDE,
          rear: trafficAccidentByOccurrenceType.REAR,
          rollover: trafficAccidentByOccurrenceType.ROLLOVER,
          rotational: trafficAccidentByOccurrenceType.ROTATIONAL,
        }, */}
                  <View style={styles.titleWrapper}>
                    <Text style={styles.key}>7 - TOTAL DE OCORRÊNCIAS POR TIPO DE ACIDENTE</Text>
                    <Text style={styles.value}>{data.traumaMechanism.trafficAccident}</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>7.1 - ATROPELAMENTO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(
                        data.trafficAccidentByOccurrenceType.trampling,
                        data.traumaMechanism.trafficAccident,
                      )}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>7.2 - FRONTAL</Text>
                    <Text style={styles.value}>
                      {this.renderValue(
                        data.trafficAccidentByOccurrenceType.front,
                        data.traumaMechanism.trafficAccident,
                      )}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>7.3 - LATERAL</Text>
                    <Text style={styles.value}>
                      {this.renderValue(
                        data.trafficAccidentByOccurrenceType.side,
                        data.traumaMechanism.trafficAccident,
                      )}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>7.4 - TRASEIRO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(
                        data.trafficAccidentByOccurrenceType.rear,
                        data.traumaMechanism.trafficAccident,
                      )}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>7.5 - CAPOTAMENTO</Text>
                    <Text style={styles.value}>
                      {this.renderValue(
                        data.trafficAccidentByOccurrenceType.rollover,
                        data.traumaMechanism.trafficAccident,
                      )}
                    </Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>7.6 - ROTACIONAL</Text>
                    <Text style={styles.value}>
                      {this.renderValue(
                        data.trafficAccidentByOccurrenceType.rotational,
                        data.traumaMechanism.trafficAccident,
                      )}
                    </Text>
                  </View>

                  <View style={styles.titleWrapper}>
                    <Text style={styles.key}>
                      8 - TOTAL DE OCORRÊNCIAS POR MEIO DE LOCOMOÇÃO DA VÍTIMA
                    </Text>
                    <Text style={styles.value}>0</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>8.1 - CARRO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>8.2 - MOTO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>8.3 - CAMINHÃO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>8.4 - ÔNIBUS</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>8.5 - VAN</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>8.6 - BICICLETA</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>8.7 - SEM INFORMACÃO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>8.8 - OUTRO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.key}>
                      9 - TOTAL DE OCORRÊNCIAS POR MEIO DE LOCOMOÇÃO DA OUTRA PARTE ENVOLVIDA
                    </Text>
                    <Text style={styles.value}>0</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.1 - CARRO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.2 - MOTO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.3 - CAMINHÃO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.4 - ÔNIBUS</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.5 - VAN</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.6 - BICICLETA</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.7 - PEDESTRE</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.8 - SEM INFORMACÃO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>9.9 - MURO/POSTE/ÁRVORE</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.titleWrapper}>
                    <Text style={styles.key}>
                      10 - TOTAL DE OCORRÊNCIAS POR EQUIPAMENTO DE SEGURANÇA
                    </Text>
                    <Text style={styles.value}>0</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>10.1 - NÃO USAVA</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>10.2 - CINTO DE 2 OU 3 PONTOS</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>10.3 - CAPACETE RETIRADO PELA EQUIPE</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>10.4 - CAPACETE RETIRADO POR OUTROS</Text>
                    <Text style={styles.value}>0 (0%)</Text>
                  </View>
                  <View style={styles.subTitleWrapper}>
                    <Text style={styles.key}>10.5 - SEM INFORMACÃO</Text>
                    <Text style={styles.value}>0 (0%)</Text>
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
}
