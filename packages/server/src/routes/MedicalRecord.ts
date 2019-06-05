import * as Router from 'koa-router'

import { MedicalRecordsController } from '../controllers/MedicalRecords'

const router = new Router()

router.prefix(`${process.env.BASE_API}/medical-records`)

router.get('/analytics', MedicalRecordsController.getAnalytics)

router.post('/report', MedicalRecordsController.generateReport)

router.get('/', MedicalRecordsController.find)

router.put('/:id', MedicalRecordsController.update)

router.delete('/:recordId', MedicalRecordsController.delete)

router.post('/', MedicalRecordsController.create)

export default router
