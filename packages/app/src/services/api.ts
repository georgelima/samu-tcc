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

export const generateReport = ({ from, to }: { from: string | null; to: string | null }) =>
  api.post('generate-medical-records-report', {
    fetchOptions: {
      body: JSON.stringify({ from, to }),
    },
  })

export const listUsers = () => api.get('list-users')

export const toggleAdmin = ({ userId }: { userId: string }) =>
  api.post('toggle-admin', {
    fetchOptions: {
      body: JSON.stringify({ userId }),
    },
  })

export const createUser = (body: { name: string; cpf: string; isAdmin: boolean; password: string }) =>
  api.post('create-user', {
    fetchOptions: {
      body: JSON.stringify(body),
    },
  })

export const deleteUser = (userId: string) =>
  api.delete('delete-user', {
    pathParameters: {
      id: userId,
    },
  })

export const currentUser = () => api.get('current-user')
