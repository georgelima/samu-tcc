import React, { useState, useRef } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Paper, IconButton, Tooltip } from '@material-ui/core'
import { Brightness1, Delete } from '@material-ui/icons'
import dateFns from 'date-fns'

import { Layout } from '../components/Layout'
import { Loader } from '../components/Loader'
import { Table } from '../components/Table'
import { RecordTableDetail } from '../components/RecordTableDetail'

import { getMedicalRecords, deleteMedicalRecord } from '../services/api'

const ROWS_PER_PAGE_OPTIONS = [20, 40, 60]

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

export const ListRecords = (props: RouteComponentProps) => {
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0])
  const [isDeletingId, setIsDeletingId] = useState(null)
  const tableRef = useRef(null)

  return (
    <Layout {...props}>
      <Paper>
        <Table
          tableRef={tableRef}
          columns={[
            { title: 'Nº da Ocorrência', field: 'occurrenceNumber' },
            {
              title: 'Data',
              field: 'date',
              render: record => <>{dateFns.format(record.date, 'DD/MM/YYYY HH:MM')}</>,
            },
            {
              title: 'Motivo da Solicitação',
              field: 'requestReason',
              render: record => getRequestReason(record.requestReason),
            },
            {
              title: 'Classificação de Risco',
              field: 'riskRating',
              render: record => (
                <Tooltip title={getRiskRating(record.riskRating)} placement="top-start">
                  <Brightness1 nativeColor={record.riskRating} />
                </Tooltip>
              ),
            },
            {
              title: 'Mecanismo do Trauma',
              field: 'traumaMechanism[0]',
              render: record => getTraumaMechanism(record.traumaMechanism[0]),
            },
            {
              title: 'Ações',
              field: '',
              render: record => (
                <Tooltip title="Remover" placement="top-start">
                  <IconButton
                    onClick={() => {
                      const yes = confirm('Deseja confirmar a remoção da ficha: ' + record.occurrenceNumber)

                      if (!yes) return

                      setIsDeletingId(record._id)
                      deleteMedicalRecord(record._id).finally(() => {
                        setIsDeletingId(null)
                        // @ts-ignore
                        tableRef.current && tableRef.current.onQueryChange()
                      })
                    }}
                  >
                    {isDeletingId === record._id ? <Loader width={18} height={18} /> : <Delete />}
                  </IconButton>
                </Tooltip>
              ),
            },
          ]}
          data={query =>
            new Promise((resolve, reject) => {
              const { page, pageSize, orderDirection, orderBy } = query

              getMedicalRecords({
                offset: page * pageSize,
                limit: pageSize,
                orderDirection,
                orderBy: orderBy && orderBy.field ? String(orderBy.field) : '',
              })
                .then(
                  // @ts-ignore
                  (res: { records: any[]; totalCount: number }) =>
                    resolve({
                      data: res.records,
                      page,
                      totalCount: res.totalCount,
                    }),
                )
                .catch((err: Error) => {
                  reject(err)
                })
            })
          }
          title="Atendimentos"
          options={{
            pageSize: rowsPerPage,
            pageSizeOptions: ROWS_PER_PAGE_OPTIONS,
            rowStyle: {
              height: '40px !important',
            },
            exportButton: true,
            search: false,
          }}
          detailPanel={rowData => <RecordTableDetail record={rowData} />}
          onChangeRowsPerPage={pageSize => setRowsPerPage(pageSize)}
        />
      </Paper>
    </Layout>
  )
}
