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

const incrementPath: (obj: object, path: string[]) => { [k: string]: any } = (obj, path) => {
  const lens = R.lensPath(path)
  const value: number = R.path(path, obj)

  return R.set(lens, (value || 0) + 1, obj)
}

export const MedicalRecordsController = {
  async generateReport(ctx: Context) {
    try {
      const { from, to } = ctx.request.body

      const startDate = from ? stringToDate(from) : null
      const endDate = to ? stringToDate(to) : null

      const records = await MedicalRecord.find(
        startDate || endDate
          ? {
              date: {
                ...(startDate ? { $gte: startDate } : {}),
                ...(endDate ? { $lte: endDate } : {}),
              },
            }
          : {},
      ).populate('victimData')

      const result = records.reduce(
        (acc, cur) => {
          let payload = acc

          // @ts-ignore
          payload = incrementPath(payload, ['frequencyByGender', cur.victimData.gender || 'U'])

          if (cur.victimData.age) {
            if (cur.victimData.age <= 14) {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '0 - 14'])
            } else if (cur.victimData.age <= 24) {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '15 - 24'])
            } else if (cur.victimData.age <= 50) {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '25 - 50'])
            } else if (cur.victimData.age <= 64) {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '51 - 64'])
            } else {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '65 +'])
            }
          }

          cur.traumaMechanism.forEach(trauma => {
            // @ts-ignore
            payload = incrementPath(payload, ['frequencyByTraumaMechanism', trauma])
          })

          // @ts-ignore
          payload = incrementPath(payload, ['frequencyByRequestReason', cur.requestReason])

          if (cur.traumaMechanism.some(x => x === 'TRAFFIC_ACCIDENT')) {
            if ((cur.findings || []).some(x => x === 'ETHYL_BREATH')) {
              // @ts-ignore
              payload = incrementPath(payload, ['ethylBreath'])
            }

            cur.accidentType.forEach(type => {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByTrafficAccidentByOccurrenceType', type])
            })
          }

          // @ts-ignore
          payload = incrementPath(payload, ['frequenceByVictimVehicle', cur.victimVehicle])
          // @ts-ignore
          payload = incrementPath(payload, ['frequenceByOtherInvolvedVehicle', cur.otherInvolved])
          //@ts-ignore
          payload = incrementPath(payload, ['frequenceBySafetyEquipment', cur.safetyEquipment])

          return payload
        },
        {
          frequencyByGender: { M: 0, F: 0, U: 0 },
          frequencyByAge: {
            '0 - 14': 0,
            '15 - 24': 0,
            '25 - 50': 0,
            '51 - 64': 0,
            '65 +': 0,
          },
          frequencyByTraumaMechanism: {
            TRAFFIC_ACCIDENT: 0,
            FAB: 0,
            FALL: 0,
            INTERLOCKING: 0,
            FPAF: 0,
            FALL_OWN_HEIGHT: 0,
            BURN: 0,
            AGGRESSION: 0,
          },
          ethylBreath: 0,
          frequencyByRequestReason: {
            CLINICAL: 0,
            SURGICAL: 0,
            OBSTETRIC: 0,
            PSYCHIATRIC: 0,
            PEDIATRIC: 0,
            INTERHOSPITAL_TRANSPORT: 0,
            OTHER: 0,
          },
          frequencyByTrafficAccidentByOccurrenceType: {
            TRAMPLING: 0,
            FRONT: 0,
            SIDE: 0,
            REAR: 0,
            ROLLOVER: 0,
            ROTATIONAL: 0,
          },
          frequenceByVictimVehicle: {
            CAR: 0,
            MOTORCYCLE: 0,
            TRUCK: 0,
            BUS: 0,
            VAN: 0,
            BIKE: 0,
            NO_INFORMATION: 0,
          },
          frequenceByOtherInvolvedVehicle: {
            CAR: 0,
            MOTORCYCLE: 0,
            TRUCK: 0,
            BUS: 0,
            VAN: 0,
            BIKE: 0,
            NO_INFORMATION: 0,
            PEDESTRIAN: 0,
            WALL_LAMPOST_TREE: 0,
          },
          frequenceBySafetyEquipment: {
            NONE: 0,
            NO_INFORMATION: 0,
            TWO_OR_THREE_POINT_BELT: 0,
            HELMET_TAKEN_BY_TEAM: 0,
            HELMET_TAKEN_BY_OTHERS: 0,
          },
        },
      )

      // End map

      ctx.status = 200
      ctx.body = {
        total: records.length,
        from,
        to,
        recordsByRequestReason: {
          clinical: result.frequencyByRequestReason.CLINICAL,
          surgical: result.frequencyByRequestReason.SURGICAL,
          obstetric: result.frequencyByRequestReason.OBSTETRIC,
          psychiatric: result.frequencyByRequestReason.PSYCHIATRIC,
          pediatric: result.frequencyByRequestReason.PEDIATRIC,
          interhospitalTransport: result.frequencyByRequestReason.INTERHOSPITAL_TRANSPORT,
          other: result.frequencyByRequestReason.OTHER,
        },
        ageGroup: result.frequencyByAge,
        gender: {
          male: result.frequencyByGender.M,
          female: result.frequencyByGender.F,
          unknown: result.frequencyByGender.U,
        },
        traumaMechanism: {
          trafficAccident: result.frequencyByTraumaMechanism.TRAFFIC_ACCIDENT,
          fab: result.frequencyByTraumaMechanism.FAB,
          fall: result.frequencyByTraumaMechanism.FALL,
          interlocking: result.frequencyByTraumaMechanism.INTERLOCKING,
          fpaf: result.frequencyByTraumaMechanism.FPAF,
          fallOwnHeight: result.frequencyByTraumaMechanism.FALL_OWN_HEIGHT,
          burn: result.frequencyByTraumaMechanism.BURN,
          aggression: result.frequencyByTraumaMechanism.AGGRESSION,
        },
        ethylBreath: result.ethylBreath,
        trafficAccidentByOccurrenceType: {
          trampling: result.frequencyByTrafficAccidentByOccurrenceType.TRAMPLING,
          front: result.frequencyByTrafficAccidentByOccurrenceType.FRONT,
          side: result.frequencyByTrafficAccidentByOccurrenceType.SIDE,
          rear: result.frequencyByTrafficAccidentByOccurrenceType.REAR,
          rollover: result.frequencyByTrafficAccidentByOccurrenceType.ROLLOVER,
          rotational: result.frequencyByTrafficAccidentByOccurrenceType.ROTATIONAL,
        },
        victimVehicle: {
          car: result.frequenceByVictimVehicle.CAR,
          motorcycle: result.frequenceByVictimVehicle.MOTORCYCLE,
          truck: result.frequenceByVictimVehicle.TRUCK,
          bus: result.frequenceByVictimVehicle.BUS,
          van: result.frequenceByVictimVehicle.VAN,
          bike: result.frequenceByVictimVehicle.BIKE,
          noInformation: result.frequenceByVictimVehicle.NO_INFORMATION,
        },
        otherInvolvedVehicle: {
          car: result.frequenceByOtherInvolvedVehicle.CAR,
          motorcycle: result.frequenceByOtherInvolvedVehicle.MOTORCYCLE,
          truck: result.frequenceByOtherInvolvedVehicle.TRUCK,
          bus: result.frequenceByOtherInvolvedVehicle.BUS,
          van: result.frequenceByOtherInvolvedVehicle.VAN,
          bike: result.frequenceByOtherInvolvedVehicle.BIKE,
          noInformation: result.frequenceByOtherInvolvedVehicle.NO_INFORMATION,
          pedestrian: result.frequenceByOtherInvolvedVehicle.PEDESTRIAN,
          wallLampostTree: result.frequenceByOtherInvolvedVehicle.WALL_LAMPOST_TREE,
        },
        safetyEquipment: {
          none: result.frequenceBySafetyEquipment.NONE,
          twoOrThreePointBelt: result.frequenceBySafetyEquipment.TWO_OR_THREE_POINT_BELT,
          helmetTakenByOthers: result.frequenceBySafetyEquipment.HELMET_TAKEN_BY_OTHERS,
          helmetTakenByTeam: result.frequenceBySafetyEquipment.HELMET_TAKEN_BY_TEAM,
          noInformation: result.frequenceBySafetyEquipment.NO_INFORMATION,
        },
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
    }
  },
  async getAnalytics(ctx: Context) {
    const { period } = ctx.request.query

    const today = dateFns.startOfDay(new Date())

    const getStartDate = () => {
      switch (period) {
        case 'LAST_7_DAYS':
          return dateFns.subDays(today, 7)
        case 'LAST_30_DAYS':
          return dateFns.subMonths(today, 1)
        case 'LAST_6_MONTHS':
          return dateFns.subMonths(today, 6)
        case 'LAST_12_MONTHS':
          return dateFns.subMonths(today, 12)
      }
    }

    try {
      const records = await MedicalRecord.find({
        date: {
          $gte: getStartDate(),
        },
      })
        .sort('date')
        .populate('victimData')
        .populate('occurrenceLocation')

      const frequency = R.pipe(
        // @ts-ignore
        R.groupBy(R.prop('stringDate')),
        // @ts-ignore
        R.map(R.length),
      )(
        // @ts-ignore
        records.map(record => ({
          ...record.toObject(),
          stringDate: dateFns.format(record.date, 'DD/MM/YYYY'),
        })),
      )

      const result = records.reduce(
        (acc, cur) => {
          let payload = acc

          // @ts-ignore
          payload = incrementPath(payload, ['frequencyByGender', cur.victimData.gender || 'U'])

          if (cur.victimData.age) {
            if (cur.victimData.age <= 14) {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '0 - 14'])
            } else if (cur.victimData.age <= 24) {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '15 - 24'])
            } else if (cur.victimData.age <= 50) {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '25 - 50'])
            } else if (cur.victimData.age <= 64) {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '51 - 64'])
            } else {
              // @ts-ignore
              payload = incrementPath(payload, ['frequencyByAge', '65 +'])
            }
          }

          cur.traumaMechanism.forEach(trauma => {
            // @ts-ignore
            payload = incrementPath(payload, ['frequencyByTraumaMechanism', trauma])
          })

          return payload
        },
        {
          frequencyByGender: { M: 0, F: 0, U: 0 },
          frequencyByAge: {
            '0 - 14': 0,
            '15 - 24': 0,
            '25 - 50': 0,
            '51 - 64': 0,
            '65 +': 0,
          },
          frequencyByTraumaMechanism: {
            TRAFFIC_ACCIDENT: 0,
            FAB: 0,
            FALL: 0,
            INTERLOCKING: 0,
            FPAF: 0,
            FALL_OWN_HEIGHT: 0,
            BURN: 0,
            AGGRESSION: 0,
          },
        },
      )

      ctx.body = {
        frequency,
        frequencyByGender: result.frequencyByGender,
        frequencyByAge: result.frequencyByAge,
        frequencyByTraumaMechanism: result.frequencyByTraumaMechanism,
        lastRecords: records,
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
    }
  },
  async find(ctx: Context) {
    const { offset, limit, orderDirection, orderBy } = ctx.request.query

    const sortBy = orderDirection === 'desc' ? 1 : -1
    const sortKey = orderBy || 'date'

    try {
      ctx.body = {
        records: await MedicalRecord.find()
          .sort({ [sortKey]: sortBy })
          .limit(Number(limit) || 0)
          .skip(Number(offset) || 0)
          .populate('victimData occurrenceLocation performedProcedures'),
        totalCount: await MedicalRecord.countDocuments(),
      }
    } catch (err) {
      console.log(err)
      ctx.status = 500
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
        performedProcedures: procedures,
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

      const performedProcedures = new PerformedProcedures({
        guedel: procedures.some(x => x === PERFORMED_PROCEDURES.GUEDEL),
        aspiration: procedures.some(x => x === PERFORMED_PROCEDURES.ASPIRATION),
        iot: procedures.some(x => x === PERFORMED_PROCEDURES.IOT),
        vm: procedures.some(x => x === PERFORMED_PROCEDURES.VM),
        maskO2: procedures.some(x => x === PERFORMED_PROCEDURES.MASK_O2),
        catheterO2: procedures.some(x => x === PERFORMED_PROCEDURES.CATHETER_02),
        chestCompression: procedures.some(x => x === PERFORMED_PROCEDURES.CHEST_COMPRESSION),
        DEA: procedures.some(x => x === PERFORMED_PROCEDURES.DEA),
        cardiacMonitoring: procedures.some(x => x === PERFORMED_PROCEDURES.CARDIAC_MONITORING),
        defibrillation: procedures.some(x => x === PERFORMED_PROCEDURES.DEFIBRILLATION),
        cardipacemakeracMonitoring: procedures.some(x => x === PERFORMED_PROCEDURES.CARDIPACEMAKERAC_MONITORING),
        neckBrace: procedures.some(x => x === PERFORMED_PROCEDURES.NECK_BRACE),
        mmss: procedures.some(x => x === PERFORMED_PROCEDURES.MMSS),
        mmii: procedures.some(x => x === PERFORMED_PROCEDURES.MMII),
        oximeter: procedures.some(x => x === PERFORMED_PROCEDURES.OXIMETER),
        cardioversion: procedures.some(x => x === PERFORMED_PROCEDURES.CARDIOVERSION),
        bandAid: procedures.some(x => x === PERFORMED_PROCEDURES.BANDAID),
        rigidBoard: procedures.some(x => x === PERFORMED_PROCEDURES.RIGID_BOARD),
        quickTake: procedures.some(x => x === PERFORMED_PROCEDURES.QUICK_TAKE),
        heating: procedures.some(x => x === PERFORMED_PROCEDURES.HEATING),
        venousAccess: procedures.some(x => x === PERFORMED_PROCEDURES.VENOUS_ACCESS),
        bleedingControl: procedures.some(x => x === PERFORMED_PROCEDURES.BLEEDING_CONTROL),
        KED: procedures.some(x => x === PERFORMED_PROCEDURES.KED),
        ventilation: procedures.some(x => x === PERFORMED_PROCEDURES.AMBU_VENTILATION),
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
