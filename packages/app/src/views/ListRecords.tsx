import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { Brightness1, Delete } from '@material-ui/icons'
import dateFns from 'date-fns'

import { Layout } from '../components/Layout'
import { Query } from '../components/Query'
import { Loader } from '../components/Loader'
import { FullLoader } from '../components/FullLoader'

import { getMedicalRecords, deleteMedicalRecord } from '../services/api'

const ROWS = [
  'Nº da Ocorrência',
  'Data',
  'Motivo da Solicitação',
  'Classificação de Risco',
  'Mecanimso do Trauma',
  'Ações',
]

const ROWS_PER_PAGE_OPTIONS = [20, 40, 60]

type Props = {}

type State = {
  page: number
  rowsPerPage: number
  isDeletingId: string | null
}

const getRequestReason = (text: string) => {
  switch (text) {
    case 'CLINICAL':
      return 'Clínico'
    case 'SURGICAL':
      return 'Cirúrgico'
    case 'OBSTETRIC':
      return 'Obstétrico'
    case 'PSYCHIATRIC':
      return 'Psiquiátrico'
    case 'PEDIATRIC':
      return 'Pediátrico'
    case 'INTERHOSPITAL_TRANSPORT':
      return 'Transporte Interhospitalar'
    default:
      return 'Outro'
  }
}

const getTraumaMechanism = (text: string) => {
  switch (text) {
    case 'TRAFFIC_ACCIDENT':
      return 'Acidente de Trânsito'
    case 'FAB':
      return 'FAB'
    case 'FALL':
      return 'Queda'
    case 'INTERLOCKING':
      return 'Encravamento'
    case 'FPAF':
      return 'FPAF'
    case 'FALL_OWN_HEIGHT':
      return 'Queda própria altura'
    case 'BURN':
      return 'Queimadura'
    case 'AGGRESSION':
      return 'Agressão'
    default:
      return 'Não aplicável'
  }
}

const getRiskRating = (text: string) => {
  switch (text) {
    case 'GREEN':
      return 'Verde'
    case 'YELLOW':
      return 'Amarelo'
    case 'RED':
      return 'Vermelho'
    case 'GREY':
      return 'Cinza'
    default:
      return ''
  }
}

type MedicalRecord = { [k: string]: any }

export class ListRecords extends React.PureComponent<RouteComponentProps> {
  state = {
    page: 0,
    rowsPerPage: ROWS_PER_PAGE_OPTIONS[0],
    isDeletingId: null,
  }

  handleChangePage = (refetch: Function, page: number) => {
    this.setState(
      () => ({
        page,
      }),
      () =>
        refetch({
          offset: page * this.state.rowsPerPage,
          limit: this.state.rowsPerPage,
        }),
    )
  }

  handleChangeRowsPerPage = (refetch: Function, rowsPerPage: number) =>
    this.setState(
      {
        rowsPerPage,
      },
      () =>
        refetch({
          offset: this.state.page * this.state.rowsPerPage,
          limit: rowsPerPage,
        }),
    )

  delete = (refetch: Function, record: MedicalRecord) => {
    const yes = confirm('Deseja confirmar a remoção da ficha: ' + record.occurrenceNumber)

    if (!yes) return

    this.setState(
      () => ({
        isDeletingId: record._id,
      }),
      () => {
        deleteMedicalRecord(record._id).finally(() =>
          this.setState(
            () => ({
              isDeletingId: null,
            }),
            () => refetch(),
          ),
        )
      },
    )
  }

  render() {
    return (
      <Layout {...this.props}>
        <Query
          method={getMedicalRecords}
          body={{ offset: this.state.page * this.state.rowsPerPage, limit: this.state.rowsPerPage }}
        >
          {({ isLoading, isRefetching, data, error, refetch }) =>
            isLoading ? (
              <FullLoader />
            ) : error || !data ? null : (
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      {ROWS.map(label => (
                        <TableCell key={'table-cell-' + label}>{label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.records.map((record: MedicalRecord) => (
                      <TableRow key={'record-row-' + record._id}>
                        <TableCell>{record.occurrenceNumber}</TableCell>
                        <TableCell>{dateFns.format(record.date, 'DD/MM/YYYY HH:MM')}</TableCell>
                        <TableCell>{getRequestReason(record.requestReason)}</TableCell>
                        <TableCell>
                          <Tooltip title={getRiskRating(record.riskRating)} placement='top-start'>
                            <Brightness1 nativeColor={record.riskRating} />
                          </Tooltip>
                        </TableCell>
                        <TableCell>{getTraumaMechanism(record.traumaMechanism[0])}</TableCell>
                        <TableCell>
                          <Tooltip title='Remover' placement='top-start'>
                            <IconButton onClick={() => this.delete(refetch, record)}>
                              {this.state.isDeletingId === record._id ? (
                                <Loader width={18} height={18} />
                              ) : (
                                <Delete />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: isRefetching ? 'space-between' : 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  {this.state.isDeletingId !== null ||
                    (isRefetching && (
                      <div style={{ marginLeft: '10px' }}>
                        <Loader type='Rings' width={25} height={25} />
                      </div>
                    ))}
                  <TablePagination
                    component='div'
                    rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                    count={data.totalCount}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={(event, page) => this.handleChangePage(refetch, page)}
                    onChangeRowsPerPage={event =>
                      this.handleChangeRowsPerPage(refetch, Number(event.target.value))
                    }
                  />
                </div>
              </Paper>
            )
          }
        </Query>
      </Layout>
    )
  }
}
