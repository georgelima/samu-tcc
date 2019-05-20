import ky from 'ky'

const ENDPOINT = String(process.env.REACT_APP_ENDPOINT)

const client = ky.extend({
  prefixUrl: ENDPOINT,
  retry: 3,
  timeout: 20000,
})

export const getMedicalRecords = ({ offset, limit }: { offset: number; limit: number }) =>
  client
    .get('', {
      searchParams: {
        offset,
        limit,
      },
    })
    .json()

export const insertMedicalRecord = (body: any) =>
  client
    .post('', {
      json: body,
    })
    .json()

export const deleteMedicalRecord = (recordId: string) => ky.delete(recordId).json()

export const getAnalytics = () => client.get('analytics').json()

export const generateReport = ({ from, to }: { from: string; to: string }) =>
  client
    .post('report', {
      json: { from, to },
    })
    .json()
