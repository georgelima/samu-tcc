import { model, Schema, Document } from 'mongoose'
import * as mongooseDelete from 'mongoose-delete'

import { IOccurrenceLocation } from './OccurrenceLocation'
import { IVictimData } from './VictimData'
import { IPhysicalExaminationFindings } from './PhysicalExaminationFindings'
import { IPerformedProcedures } from './PerformedProcedures'

type RiskRating = 'GREEN' | 'YELLOW' | 'RED' | 'GREY'

type RequestReason =
  | 'CLINICAL'
  | 'SURGICAL'
  | 'OBSTETRIC'
  | 'PSYCHIATRIC'
  | 'PEDIATRIC'
  | 'INTERHOSPITAL_TRANSPORT'
  | 'OTHER'

type LocationSituation =
  | 'SAFE_SCENE'
  | 'UNSAGE_SCENE'
  | 'HARD_ACCESS'
  | 'ANIMALS_RISK'
  | 'UNIDENTIFIED_STREET'
  | 'FIRE'
  | 'DANGEROUS_PRODUCT'
  | 'CROWDING'
  | 'THIRD_PARTIES_RISK'
  | 'OIL_ON_THE_ROAD'

type VictimSituation =
  | 'EVASION'
  | 'NOT_LOCALIZED'
  | 'AGGRESSIVE'
  | 'TRAPPED_IN_THE_WRECKAGE'
  | 'OTHER'

type Complications = 'QTA_ON_LOCAL' | 'QTA_ON_THE_WAY' | 'FALSE_CALL' | 'MULTIPLE_VICTIMS'

type SupportRequest = 'NO' | 'USA' | 'USB' | '190' | '193' | 'OTHER'

type Allergy = 'DENY' | 'UNIFORMED' | 'CANT_INFORM' | 'YES'

type PersonalBackground =
  | 'HAS'
  | 'HEART_DISEASE'
  | 'PREVIOUS_IAM'
  | 'PREVIOUS_AVE'
  | 'CONVULSIONS'
  | 'DIABETES'
  | 'SURGICAL'
  | 'ASTHMA_BRONCHITIS_DPOC'
  | 'DENY_PREVIOUS_TREATMENT'
  | 'CANT_INFORM'
  | 'OTHER'

type GlasgowOcularOpening = 1 | 2 | 3 | 4

type GlasgowVerbalResponse = 1 | 2 | 3 | 4 | 5

type GlasgowMotorResponse = 1 | 2 | 3 | 4 | 5 | 6

type TraumaMechanism =
  | 'NOT_APPLICABLE'
  | 'TRAFFIC_ACCIDENT'
  | 'FAB'
  | 'FALL'
  | 'INTERLOCKING'
  | 'FPAF'
  | 'FALL_OWN_HEIGHT'
  | 'BURN'
  | 'AGGRESSION'

type Pulse = 'REGULAR' | 'FULL' | 'IRREGULAR' | 'THIN' | 'MISSING_PCR'

type AccidentType = 'TRAMPLING' | 'FRONT' | 'SIDE' | 'REAR' | 'ROLLOVER' | 'ROTATIONAL'

type VictimPostionInVehicle =
  | 'NO_INFORMATION'
  | 'FRONT_PASSENGER'
  | 'DRIVER_OR_MOTORCYCLE_RUMP'
  | 'VEHICLE_DRIVER'
  | 'REAR_PASSENGER'

type SafetyEquipment =
  | 'NONE'
  | 'NO_INFORMATION'
  | 'TWO_OR_THREE_POINT_BELT'
  | 'HELMET_TAKEN_BY_TEAM'
  | 'HELMET_TAKEN_BY_OTHERS'

type VictimLocation = 'WITHOUT_WRECKAGE' | 'TRAPPED_IN_THE_WRECKAGE' | 'OUT_OF_VEHICLE'

type VictimVehicle = 'CAR' | 'MOTORCYCLE' | 'TRUCK' | 'BUS' | 'VAN' | 'BIKE' | 'NO_INFORMATION'

type OtherInvolved = VictimVehicle | 'PEDESTRIAN' | 'WALL_LAMPOST_TREE' | 'VAN'

type Airways =
  | 'FREE'
  | 'TOTAL_OBSTRUCTION'
  | 'GLOTTIS_EDEMA'
  | 'STRANGE_BODY'
  | 'SECRETION'
  | 'TOTAL_OBSTRUCTION'

type Breath =
  | 'SPONTANEOUS'
  | 'EUPHONIC'
  | 'APNEA'
  | 'DYSPNEA'
  | 'IOT'
  | 'BRANDIPNEA'
  | 'TACHYPNEA'
  | 'GASPING'

type PulmonaryAuscultation =
  | 'NORMAL'
  | 'SNORING_WHEEZING_DE'
  | 'MV_DECREASED_DE'
  | 'MV_ABSENT_DE'
  | 'NOT_PERFORMED'
  | 'RALES_DE'

type Findings =
  | 'ETHYL_BREATH'
  | 'HEMOPTYSIS'
  | 'SUBCUTANEOUS_EMPHYSEMA'
  | 'CRACKLING'
  | 'BLEEDING'
  | 'OTHER'

type Skin =
  | 'SKIN'
  | 'STAINED'
  | 'DISCOLORED'
  | 'HOT'
  | 'COLD'
  | 'ICTERIC'
  | 'CYANOTIC'
  | 'DAMP'
  | 'DRY'
  | 'NORMAL'
  | 'RETARDED'
  | 'CYANOTIC'

type HeartAuscultation = 'NORMAL' | 'BLOW' | 'HYPOPHONESE' | 'ARRHYTHMIA' | 'UNREALIZED'

type NeurologicalExamination = 'NORMAL' | 'SHAKING' | 'CONVULSION' | 'SOMNOLENCE' | 'OBNUBILATION'

type LeftRight = 'D' | 'E'

type MotorDeficit = 'MSD' | 'MID' | 'MSE' | 'MIE'

type Pupils = 'ISOCHORIC' | 'ANISOCORTICAL' | 'MYOTIC' | 'MYTRIATIC' | 'REACTIVE' | 'NON-REACTIVE'

type ContractionType = 'WEAK' | 'STRONG' | 'MODERATE'

export interface IMedicalRecord extends Document {
  date: Date
  vtr: string
  riskRating: RiskRating
  occurrenceNumber: number
  doctor: string
  requestReason: RequestReason
  requestReasonText: string
  // ref: OccurrenceLocation
  occurrenceLocation: IOccurrenceLocation
  locationSituation: LocationSituation[]
  victimSituation: VictimSituation
  victimSituationText: string
  complications: Complications
  numberOfVictims: number
  otherServices: boolean
  otherServicesText: string
  supportRequest: SupportRequest[]
  supportRequestText: string
  // ref: VictimData
  victimData: IVictimData
  initialPA: string
  currentPA: string
  initialFC: string
  currentFC: string
  initialFR: string
  currentFR: string
  initialDEXTRO: string
  currentDEXTRO: string
  initialSatO2: string
  currentSatO2: string
  initialTCelsius: string
  currentTCelsius: string
  allergy: Allergy
  allergyText: string
  personalBackground: PersonalBackground[]
  personalBackgroundText: string
  glasgowOcularOpening: GlasgowOcularOpening
  glasgowVerbalResponse: GlasgowVerbalResponse
  glasgowMotorResponse: GlasgowMotorResponse
  glasgowTotal: number
  traumaMechanism: TraumaMechanism[]
  fallHeight: number
  responsive: boolean
  pulse: Pulse
  accidentType: AccidentType[]
  victimPostionInVehicle: VictimPostionInVehicle
  safetyEquipment: SafetyEquipment
  victimLocation: VictimLocation
  wandering: boolean
  foundPosition: string
  victimVehicle: VictimVehicle
  otherInvolved: OtherInvolved
  airways: Airways[]
  secretionText: string
  breath: Breath[]
  pulmonaryAuscultation: PulmonaryAuscultation[]
  findings: Findings[]
  findingsText: string
  skin: Skin[]
  heartAuscultation: HeartAuscultation[]
  neurologicalExamination: NeurologicalExamination[]
  aphasia: boolean
  otorrhagia: LeftRight[]
  racoonEyes: LeftRight[]
  battle: LeftRight[]
  motorDeficit: MotorDeficit[]
  stiffNeck: boolean
  pupils: Pupils[]
  obstetricsG: string
  obstetricsP: string
  obstetricsA: string
  obstetricsIG: string
  labour: boolean
  contractions: boolean
  contractionType: ContractionType
  contractionNumber: number
  contractionMin: number
  amnioticSacBroke: boolean
  touchCm: number
  abortion: boolean
  vaginalBleeding: boolean
  rnLive: boolean
  dequiPlacenta: boolean
  firstApgar: string
  secondApgar: string
  // ref: PhysicalExaminationFindings
  physicalExaminationFindings: IPhysicalExaminationFindings
  // ref: PerformedProcedures
  performedProcedures: IPerformedProcedures
  doctorPrescription: string
  nursingMedicalReport: string
  duringTransport: string
  patientRefusedTreatment: boolean
  death: boolean
  cadaverRigidity: boolean
  livorMortis: boolean
  decapitation: boolean
  carbonization: boolean
  hemiBody: boolean
  createdAt: Date
  updatedAt: Date
}

const MedicalRecordSchema = new Schema({
  date: Date,
  vtr: String,
  riskRating: String,
  occurrenceNumber: Number,
  doctor: String,
  requestReason: String,
  requestReasonText: String,
  // ref: OccurrenceLocation
  occurrenceLocation: { type: Schema.Types.ObjectId, ref: 'OccurrenceLocation' },
  locationSituation: [String],
  victimSituation: String,
  victimSituationText: String,
  complications: String,
  numberOfVictims: Number,
  otherServices: Boolean,
  otherServicesText: String,
  supportRequest: [String],
  supportRequestText: String,
  // ref: VictimData
  victimData: { type: Schema.Types.ObjectId, ref: 'VictimData' },
  initialPA: String,
  currentPA: String,
  initialFC: String,
  currentFC: String,
  initialFR: String,
  currentFR: String,
  initialDEXTRO: String,
  currentDEXTRO: String,
  initialSatO2: String,
  currentSatO2: String,
  initialTCelsius: String,
  currentTCelsius: String,
  allergy: String,
  allergyText: String,
  personalBackground: [String],
  personalBackgroundText: String,
  glasgowOcularOpening: Number,
  glasgowVerbalResponse: Number,
  glasgowMotorResponse: Number,
  glasgowTotal: Number,
  traumaMechanism: [String],
  fallHeight: Number,
  responsive: Boolean,
  pulse: String,
  accidentType: [String],
  victimPostionInVehicle: String,
  safetyEquipment: String,
  victimLocation: String,
  wandering: Boolean,
  foundPosition: String,
  victimVehicle: String,
  otherInvolved: String,
  airways: [String],
  secretionText: String,
  breath: [String],
  pulmonaryAuscultation: [String],
  findings: [String],
  findingsText: String,
  skin: [String],
  heartAuscultation: [String],
  neurologicalExamination: [String],
  aphasia: Boolean,
  otorrhagia: [String],
  racoonEyes: [String],
  battle: [String],
  motorDeficit: [String],
  stiffNeck: Boolean,
  pupils: [String],
  obstetricsG: String,
  obstetricsP: String,
  obstetricsA: String,
  obstetricsIG: String,
  labour: Boolean,
  contractions: Boolean,
  contractionType: String,
  contractionNumber: Number,
  contractionMin: Number,
  amnioticSacBroke: Boolean,
  touchCm: Number,
  abortion: Boolean,
  vaginalBleeding: Boolean,
  rnLive: Boolean,
  dequiPlacenta: Boolean,
  firstApgar: String,
  secondApgar: String,
  // ref: PhysicalExaminationFindings
  physicalExaminationFindings: { type: Schema.Types.ObjectId, ref: 'PhysicalExaminationFindings' },
  // ref: PerformedProcedures
  performedProcedures: { type: Schema.Types.ObjectId, ref: 'PerformedProcedures' },
  doctorPrescription: String,
  nursingMedicalReport: String,
  duringTransport: String,
  patientRefusedTreatment: Boolean,
  death: Boolean,
  cadaverRigidity: Boolean,
  livorMortis: Boolean,
  decapitation: Boolean,
  carbonization: Boolean,
  hemiBody: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
})

MedicalRecordSchema.plugin(mongooseDelete, { overrideMethods: true })

export const MedicalRecord = model<IMedicalRecord>('MedicalRecord', MedicalRecordSchema)
