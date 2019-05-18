import ky from 'ky'

// const ENDPOINT = 'https://samu-server-george-tcc.georgelima.now.sh/api/v1/medical-records'
const ENDPOINT = 'http://localhost:8001/api/v1/medical-records'

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

export const getAnalytics = () => ky.get(ENDPOINT + '/analytics').json()
