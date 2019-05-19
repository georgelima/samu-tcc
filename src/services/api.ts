import ky from 'ky'

const ENDPOINT = String(process.env.REACT_APP_ENDPOINT)

export const getMedicalRecords = ({ offset, limit }: { offset: number; limit: number }) =>
  ky
    .get(ENDPOINT, {
      searchParams: {
        offset,
        limit,
      },
    })
    .json()

export const insertMedicalRecord = (body: any) =>
  ky
    .post(ENDPOINT, {
      json: body,
    })
    .json()

export const deleteMedicalRecord = (recordId: string) => ky.delete(ENDPOINT + `/${recordId}`).json()

export const getAnalytics = () =>
  ky
    .get(ENDPOINT + '/analytics', {
      retry: 4,
      timeout: 20000,
    })
    .json()
