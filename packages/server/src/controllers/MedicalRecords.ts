import { Context } from 'koa'
import * as dateFns from 'date-fns'
import * as R from 'ramda'
import * as eres from 'eres'

import { MedicalRecord } from '../models/MedicalRecord'
import { OccurrenceLocation, IOccurrenceLocation } from '../models/OccurrenceLocation'
import { VictimData } from '../models/VictimData'
import { PhysicalExaminationFindings } from '../models/PhysicalExaminationFindings'
import { PerformedProcedures } from '../models/PerformedProcedures'

import { GoogleMaps } from '../config/GoogleMaps'

const PERFORMED_PROCEDURES = {
  GUEDEL: 'GUEDEL',
  ASPIRATION: 'ASPIRATION',
  IOT: 'IOT',
  VM: 'VM',
  MASK_O2: 'MASK_O2',
  CATHETER_02: 'CATHETER_02',
  AMBU_VENTILATION: 'AMBU_VENTILATION',
  CHEST_COMPRESSION: 'CHEST_COMPRESSION',
  DEA: 'DEA',
  CARDIAC_MONITORING: 'CARDIAC_MONITORING',
  DEFIBRILLATION: 'DEFIBRILLATION',
  CARDIPACEMAKERAC_MONITORING: 'CARDIPACEMAKERAC_MONITORING',
  NECK_BRACE: 'NECK_BRACE',
  IMMOBILIZATION: 'IMMOBILIZATION',
  MMSS: 'MMSS',
  MMII: 'MMII',
  OXIMETER: 'OXIMETER',
  CARDIOVERSION: 'CARDIOVERSION',
  BANDAID: 'BANDAID',
  RIGID_BOARD: 'RIGID_BOARD',
  QUICK_TAKE: 'QUICK_TAKE',
  HEATING: 'HEATING',
  VENOUS_ACCESS: 'VENOUS_ACCESS',
  BLEEDING_CONTROL: 'BLEEDING_CONTROL',
  KED: 'KED',
  OTHER: 'OTHER',
}

const stringToDate = function(dateString, timeString = '') {
  const [dd, mm, yyyy] = dateString.split('/')

  if (!timeString) return new Date(yyyy, mm - 1, dd)

  const [hh, ss] = timeString.split(':')

  return new Date(yyyy, mm - 1, dd, Number(hh), Number(ss))
}

export const MedicalRecordsController = {
  async generateReport(ctx: Context) {
    try {
      const { body } = ctx.request
      const { from, to } = body

      const startDate = stringToDate(from)
      const endDate = stringToDate(to)

      const records = await MedicalRecord.find({
        date: { $gte: startDate, $lte: endDate },
      }).populate('victimData')

      const recordsByRequestReason = records.reduce(
        (acc, cur) => {
          return { ...acc, [cur.requestReason]: acc[cur.requestReason] + 1 }
        },
        {
          CLINICAL: 0,
          SURGICAL: 0,
          OBSTETRIC: 0,
          PSYCHIATRIC: 0,
          PEDIATRIC: 0,
          INTERHOSPITAL_TRANSPORT: 0,
          OTHER: 0,
        },
      )

      const ageGroup = records.reduce(
        (acc, cur) => {
          if (cur.victimData.age) {
            if (cur.victimData.age <= 14) {
              return { ...acc, '0 - 14': acc['0 - 14'] + 1 }
            }
            if (cur.victimData.age <= 24) {
              return { ...acc, '15 - 24': acc['15 - 24'] + 1 }
            }
            if (cur.victimData.age <= 50) {
              return { ...acc, '25 - 50': acc['25 - 50'] + 1 }
            }
            if (cur.victimData.age <= 64) {
              return { ...acc, '51 - 64': acc['51 - 64'] + 1 }
            }
            return { ...acc, '65 +': acc['65 +'] + 1 }
          }

          return acc
        },
        {
          '0 - 14': 0,
          '15 - 24': 0,
          '25 - 50': 0,
          '51 - 64': 0,
          '65 +': 0,
        },
      )

      const genderGroup = records.reduce(
        (acc, cur) => ({ ...acc, [cur.victimData.gender]: acc[cur.victimData.gender] + 1 }),
        { M: 0, F: 0, U: 0 },
      )

      const traumaMechanismGroup = R.pipe(
        R.map(R.prop('traumaMechanism')),
        R.flatten,
        R.reduce(
          (acc, cur) => ({
            ...acc,
            // @ts-ignore
            [cur]: acc[cur] + 1,
          }),
          {
            TRAFFIC_ACCIDENT: 0,
            FAB: 0,
            FALL: 0,
            INTERLOCKING: 0,
            FPAF: 0,
            FALL_OWN_HEIGHT: 0,
            BURN: 0,
            AGGRESSION: 0,
          },
        ),
      )(records)

      const ethylBreath = records.reduce((acc, cur) => {
        return (cur.findings || []).some(x => x === 'ETHYL_BREATH') ? acc + 1 : acc
      }, 0)

      const trafficAccidentByOccurrenceType = records
        .filter(cur => cur.traumaMechanism.some(x => x === 'TRAFFIC_ACCIDENT'))
        .map(cur => cur.accidentType)
        .flat()
        .reduce((acc, cur) => ({ ...acc, [cur]: acc[cur] + 1 }), {
          TRAMPLING: 0,
          FRONT: 0,
          SIDE: 0,
          REAR: 0,
          ROLLOVER: 0,
          ROTATIONAL: 0,
        })

      ctx.body = {
        total: records.length,
        from,
        to,
        recordsByRequestReason: {
          clinical: recordsByRequestReason.CLINICAL,
          surgical: recordsByRequestReason.SURGICAL,
          obstetric: recordsByRequestReason.OBSTETRIC,
          psychiatric: recordsByRequestReason.PSYCHIATRIC,
          pediatric: recordsByRequestReason.PEDIATRIC,
          interhospitalTransport: recordsByRequestReason.INTERHOSPITAL_TRANSPORT,
          other: recordsByRequestReason.OTHER,
        },
        ageGroup,
        gender: {
          male: genderGroup.M,
          female: genderGroup.F,
        },
        traumaMechanism: {
          trafficAccident: traumaMechanismGroup.TRAFFIC_ACCIDENT,
          fab: traumaMechanismGroup.FAB,
          fall: traumaMechanismGroup.FALL,
          interlocking: traumaMechanismGroup.INTERLOCKING,
          fpaf: traumaMechanismGroup.FPAF,
          fallOwnHeight: traumaMechanismGroup.FALL_OWN_HEIGHT,
          burn: traumaMechanismGroup.BURN,
          aggression: traumaMechanismGroup.AGGRESSION,
        },
        ethylBreath,
        trafficAccidentByOccurrenceType: {
          trampling: trafficAccidentByOccurrenceType.TRAMPLING,
          front: trafficAccidentByOccurrenceType.FRONT,
          side: trafficAccidentByOccurrenceType.SIDE,
          rear: trafficAccidentByOccurrenceType.REAR,
          rollover: trafficAccidentByOccurrenceType.ROLLOVER,
          rotational: trafficAccidentByOccurrenceType.ROTATIONAL,
        },
      }
      ctx.status = 200
    } catch (err) {
      console.log(err)
      ctx.status = 500
    }
  },
  async getAnalytics(ctx: Context) {
    try {
      const today = new Date()
      const thirtyDaysAgo = dateFns.subDays(today, 30)

      const records = await MedicalRecord.find()
        .sort('-date')
        .populate('victimData')
        .populate('occurrenceLocation')
      const last30DaysRecords = records.filter(record =>
        dateFns.isWithinRange(record.date, thirtyDaysAgo, today),
      )

      const frequency = R.pipe(
        // @ts-ignore
        R.groupBy(R.prop('stringDate')),
        // @ts-ignore
        R.map(R.length),
      )(
        // @ts-ignore
        last30DaysRecords.map(record => ({
          ...record.toObject(),
          stringDate: dateFns.format(record.date, 'DD/MM/YYYY'),
        })),
      )

      const frequencyByGender = records.reduce(
        (acc, cur) => ({ ...acc, [cur.victimData.gender]: acc[cur.victimData.gender] + 1 }),
        { M: 0, F: 0, U: 0 },
      )

      const frequencyByAge = records.reduce(
        (acc, cur) => {
          if (cur.victimData.age) {
            if (cur.victimData.age <= 14) {
              return { ...acc, '0 - 14': acc['0 - 14'] + 1 }
            }
            if (cur.victimData.age <= 24) {
              return { ...acc, '15 - 24': acc['15 - 24'] + 1 }
            }
            if (cur.victimData.age <= 50) {
              return { ...acc, '25 - 50': acc['25 - 50'] + 1 }
            }
            if (cur.victimData.age <= 64) {
              return { ...acc, '51 - 64': acc['51 - 64'] + 1 }
            }
            return { ...acc, '65 +': acc['65 +'] + 1 }
          }

          return acc
        },
        {
          '0 - 14': 0,
          '15 - 24': 0,
          '25 - 50': 0,
          '51 - 64': 0,
          '65 +': 0,
        },
      )

      const frequencyByTraumaMechanism = R.pipe(
        R.map(R.prop('traumaMechanism')),
        R.flatten,
        R.reduce(
          (acc, cur) => ({
            ...acc,
            // @ts-ignore
            [cur]: acc[cur] + 1,
          }),
          {
            TRAFFIC_ACCIDENT: 0,
            FAB: 0,
            FALL: 0,
            INTERLOCKING: 0,
            FPAF: 0,
            FALL_OWN_HEIGHT: 0,
            BURN: 0,
            AGGRESSION: 0,
          },
        ),
      )(records)

      ctx.body = {
        frequency,
        frequencyByGender,
        frequencyByAge,
        frequencyByTraumaMechanism,
        lastRecords: records,
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
    }
  },
  async find(ctx: Context) {
    const { offset, limit } = ctx.request.query

    ctx.body = {
      records: await MedicalRecord.find()
        .limit(Number(limit) || 0)
        .skip(Number(offset) || 0)
        .sort('-date')
        .populate('victimData'),
      totalCount: await MedicalRecord.countDocuments(),
    }
  },
  async findById(ctx: Context) {
    ctx.body = null
  },
  async create(ctx: Context) {
    try {
      const { body } = ctx.request

      let {
        location,
        locationText,
        address,
        addressNumber,
        neighborhood,
        city,
        lat,
        lng,
        victimName,
        victimDoc,
        victimAge,
        victimGender,
        victimAddress,
        victimAddressNumber,
        victimAddressNeighborhood,
        victimAddressCity,
        victimPhone,
        companion,
        companionDoc,
        companionProximityLevel,
        companionPhone,
        physicalExaminationFindingsHead,
        physicalExaminationFindingsNeck,
        physicalExaminationFindingsChest,
        physicalExaminationFindingsAbdomen,
        physicalExaminationFindingsPelvis,
        physicalExaminationFindingsExtremities,
        date,
        time,
        ...payload
      } = body

      const [googleMapsErr, googleMapsResponse] = await eres(
        GoogleMaps.geocode({
          address: `${addressNumber} ${address}, ${neighborhood}, ${city}`,
        }).asPromise(),
      )

      // Let's try to guess the coords using the address
      if (
        !googleMapsErr &&
        googleMapsResponse.json.results[0] &&
        googleMapsResponse.json.results[0].geometry &&
        googleMapsResponse.json.results[0].geometry.location
      ) {
        lat = googleMapsResponse.json.results[0].geometry.location.lat
        lng = googleMapsResponse.json.results[0].geometry.location.lng
      }

      const occurrenceLocation = new OccurrenceLocation({
        location,
        locationText,
        address,
        number: addressNumber,
        neighborhood,
        city,
        lat,
        lng,
      })

      const victimData = new VictimData({
        name: victimName,
        doc: victimDoc,
        age: victimAge,
        gender: victimGender,
        address: victimAddress,
        number: victimAddressNumber,
        neighborhood: victimAddressNeighborhood,
        city: victimAddressCity,
        phone: victimPhone,
        companion,
        companionDoc,
        companionProximityLevel,
        companionPhone,
      })

      const physicalExaminationFindings = new PhysicalExaminationFindings({
        head: physicalExaminationFindingsHead,
        neck: physicalExaminationFindingsNeck,
        chest: physicalExaminationFindingsChest,
        abdomen: physicalExaminationFindingsAbdomen,
        pelvis: physicalExaminationFindingsPelvis,
        extremities: physicalExaminationFindingsExtremities,
      })

      const keys = Object.keys(PERFORMED_PROCEDURES)

      const performedProcedures = new PerformedProcedures({
        guedel: keys.some(x => x === PERFORMED_PROCEDURES.GUEDEL),
        aspiration: keys.some(x => x === PERFORMED_PROCEDURES.ASPIRATION),
        iot: keys.some(x => x === PERFORMED_PROCEDURES.IOT),
        vm: keys.some(x => x === PERFORMED_PROCEDURES.VM),
        maskO2: keys.some(x => x === PERFORMED_PROCEDURES.MASK_O2),
        catheterO2: keys.some(x => x === PERFORMED_PROCEDURES.CATHETER_02),
        chestCompression: keys.some(x => x === PERFORMED_PROCEDURES.CHEST_COMPRESSION),
        DEA: keys.some(x => x === PERFORMED_PROCEDURES.DEA),
        cardiacMonitoring: keys.some(x => x === PERFORMED_PROCEDURES.CARDIAC_MONITORING),
        defibrillation: keys.some(x => x === PERFORMED_PROCEDURES.DEFIBRILLATION),
        cardipacemakeracMonitoring: keys.some(
          x => x === PERFORMED_PROCEDURES.CARDIPACEMAKERAC_MONITORING,
        ),
        neckBrace: keys.some(x => x === PERFORMED_PROCEDURES.NECK_BRACE),
        mmss: keys.some(x => x === PERFORMED_PROCEDURES.MMSS),
        mmii: keys.some(x => x === PERFORMED_PROCEDURES.MMII),
        oximeter: keys.some(x => x === PERFORMED_PROCEDURES.OXIMETER),
        cardioversion: keys.some(x => x === PERFORMED_PROCEDURES.CARDIOVERSION),
        bandAid: keys.some(x => x === PERFORMED_PROCEDURES.BANDAID),
        rigidBoard: keys.some(x => x === PERFORMED_PROCEDURES.RIGID_BOARD),
        quickTake: keys.some(x => x === PERFORMED_PROCEDURES.QUICK_TAKE),
        heating: keys.some(x => x === PERFORMED_PROCEDURES.HEATING),
        venousAccess: keys.some(x => x === PERFORMED_PROCEDURES.VENOUS_ACCESS),
        bleedingControl: keys.some(x => x === PERFORMED_PROCEDURES.BLEEDING_CONTROL),
        KED: keys.some(x => x === PERFORMED_PROCEDURES.KED),
        ventilation: keys.some(x => x === PERFORMED_PROCEDURES.AMBU_VENTILATION),
      })

      const medicalRecord = new MedicalRecord({
        ...payload,
        date: stringToDate(date, time),
        occurrenceLocation: occurrenceLocation._id,
        victimData: victimData._id,
        physicalExaminationFindings: physicalExaminationFindings._id,
        performedProcedures: performedProcedures._id,
      })

      await occurrenceLocation.save()
      await victimData.save()
      await physicalExaminationFindings.save()
      await performedProcedures.save()
      await medicalRecord.save()

      ctx.body = { message: 'OK' }
      ctx.status = 200
    } catch (err) {
      console.log('[Insert Medical Record]', err)
      ctx.body = { message: err.message }
      ctx.status = 500
    }
  },
  async update(ctx: Context) {},
  async delete(ctx: Context) {
    try {
      // @ts-ignore
      await MedicalRecord.deleteById(ctx.params.recordId)
      ctx.body = { ok: true }
    } catch (err) {
      console.log(err)
      ctx.status = 500
      ctx.body = { ok: false }
    }
  },
}
