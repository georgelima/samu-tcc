import { api } from './apipeline'

export const login = ({
  cpf,
  password,
}: {
  cpf: string
  password: string
}): Promise<{ token: string; error: string }> =>
  api.post('login', {
    fetchOptions: {
      body: JSON.stringify({
        cpf,
        password,
      }),
    },
  })

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
  api.get('get-medical-records', {
    queryParameters: {
      offset,
      limit,
      orderDirection,
      orderBy,
    },
  })

export const insertMedicalRecord = (body: any) =>
  api.post('insert-medical-records', {
    fetchOptions: {
      body: JSON.stringify(body),
    },
  })

export const deleteMedicalRecord = (recordId: string) =>
  api.delete('delete-medical-records', {
    pathParameters: {
      id: recordId,
    },
  })

export const getAnalytics = ({ period }: { period: string }) =>
  api.get('medical-records-analytics', {
    queryParameters: {
      period,
    },
  })

export const generateReport = ({ from, to }: { from: string; to: string }) =>
  api.post('generate-medical-records-report', {
    fetchOptions: {
      body: JSON.stringify({ from, to }),
    },
  })
