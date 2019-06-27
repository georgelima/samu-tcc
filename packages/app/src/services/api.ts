import ky from 'ky'

import { Auth } from './auth'

const client = ky.extend({
  prefixUrl: String(process.env.REACT_APP_ENDPOINT),
  retry: 3,
  timeout: 20000,
  headers: new Headers({
    Authorization: Auth.getAuthToken(),
  }),
})

export const login = ({
  cpf,
  password,
}: {
  cpf: string
  password: string
}): Promise<{ token: string; error: string }> =>
  client
    .post('auth/login', {
      json: {
        cpf,
        password,
      },
    })
    .json()

export const getMedicalRecords = ({
  offset,
  limit,
  orderDirection,
  orderBy,
}: {
  offset: number
  limit: number
  orderDirection: string
  orderBy: string
}) =>
  client
    .get('medical-records', {
      searchParams: {
        offset,
        limit,
        orderDirection,
        orderBy,
      },
    })
    .json()

export const insertMedicalRecord = (body: any) =>
  client
    .post('medical-records', {
      json: body,
    })
    .json()

export const deleteMedicalRecord = (recordId: string) => ky.delete('medical-records/' + recordId).json()

export const getAnalytics = ({ period }: { period: string }) =>
  client
    .get('medical-records/analytics', {
      searchParams: {
        period,
      },
    })
    .json()

export const generateReport = ({ from, to }: { from: string; to: string }) =>
  client
    .post('medical-records/report', {
      json: { from, to },
    })
    .json()
