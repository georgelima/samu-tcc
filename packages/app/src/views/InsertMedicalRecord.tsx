import React from 'react'
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Snackbar,
} from '@material-ui/core'
import { Formik } from 'formik'
import dateFns from 'date-fns'
import * as yup from 'yup'
import { RouteComponentProps } from 'react-router-dom'

import { Layout } from '../components/Layout'
import { TextInput } from '../components/TextInput'
import { Select } from '../components/Select'
import { MaskTextInput } from '../components/MaskTextInput'
import { Checkbox } from '../components/Checkbox'
import { Switch } from '../components/Switch'

import * as Service from '../services/api'

const RISK_RATING = { GREEN: 'GREEN', YELLOW: 'YELLOW', RED: 'RED', GREY: 'GREY' }

const REQUEST_REASON = {
  CLINICAL: 'CLINICAL',
  SURGICAL: 'SURGICAL',
  OBSTETRIC: 'OBSTETRIC',
  PSYCHIATRIC: 'PSYCHIATRIC',
  PEDIATRIC: 'PEDIATRIC',
  INTERHOSPITAL_TRANSPORT: 'INTERHOSPITAL_TRANSPORT',
  OTHER: 'OTHER',
}

const LOCATION = {
  STREET: 'STREET',
  PUBLIC_PLACE: 'PUBLIC_PLACE',
  RESIDENCE: 'RESIDENCE',
  HIGHWAY: 'HIGHWAY',
  OTHER: 'OTHER',
}

const LOCATION_SITUATION = {
  SAFE_SCENE: 'SAFE_SCENE',
  UNSAFE_SCENE: 'UNSAFE_SCENE',
  HARD_ACCESS: 'HARD_ACCESS',
  ANIMALS_RISK: 'ANIMALS_RISK',
  UNIDENTIFIED_STREET: 'UNIDENTIFIED_STREET',
  FIRE: 'FIRE',
  DANGEROUS_PRODUCT: 'DANGEROUS_PRODUCT',
  CROWDING: 'CROWDING',
  THIRD_PARTIES_RISK: 'THIRD_PARTIES_RISK',
  OIL_ON_THE_ROAD: 'OIL_ON_THE_ROAD',
}

const VICTIM_SITUATION = {
  EVASION: 'EVASION',
  NOT_LOCALIZED: 'NOT_LOCALIZED',
  AGGRESSIVE: 'AGGRESSIVE',
  TRAPPED_IN_THE_WRECKAGE: 'TRAPPED_IN_THE_WRECKAGE',
  OTHER: 'OTHER',
}

const COMPLICATIONS = {
  QTA_ON_LOCAL: 'QTA_ON_LOCAL',
  QTA_ON_THE_WAY: 'QTA_ON_THE_WAY',
  FALSE_CALL: 'FALSE_CALL',
  MULTIPLE_VICTIMS: 'MULTIPLE_VICTIMS',
}

const SUPPORT_REQUEST = {
  NO: 'NO',
  USA: 'USA',
  USB: 'USB',
  190: '190',
  193: '193',
  OTHER: 'OTHER',
}

const ALLERGY = {
  DENY: 'DENY',
  UNINFORMED: 'UNINFORMED',
  CANT_INFORM: 'CANT_INFORM',
  YES: 'YES',
}

const MEDICINES_IN_USE = {
  DENY: 'DENY',
  UNINFORMED: 'UNINFORMED',
  CANT_INFORM: 'CANT_INFORM',
  YES: 'YES',
}

const PERSONAL_BACKGROUND = {
  HAS: 'HAS',
  HEART_DISEASE: 'HEART_DISEASE',
  PREVIOUS_IAM: 'PREVIOUS_IAM',
  PREVIOUS_AVE: 'PREVIOUS_AVE',
  CONVULSIONS: 'CONVULSIONS',
  DIABETES: 'DIABETES',
  SURGICAL: 'SURGICAL',
  ASTHMA_BRONCHITIS_DPOC: 'ASTHMA_BRONCHITIS_DPOC',
  DENY_PREVIOUS_TREATMENT: 'DENY_PREVIOUS_TREATMENT',
  CANT_INFORM: 'CANT_INFORM',
  OTHER: 'OTHER',
}

export const TRAUMA_MECHANISM = {
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  TRAFFIC_ACCIDENT: 'TRAFFIC_ACCIDENT',
  FAB: 'FAB',
  FALL: 'FALL',
  INTERLOCKING: 'INTERLOCKING',
  FPAF: 'FPAF',
  FALL_OWN_HEIGHT: 'FALL_OWN_HEIGHT',
  BURN: 'BURN',
  AGGRESSION: 'AGGRESSION',
}

const PULSE = {
  REGULAR: 'REGULAR',
  FULL: 'FULL',
  IRREGULAR: 'IRREGULAR',
  THIN: 'THIN',
  MISSING_PCR: 'MISSING_PCR',
}

const ACCIDENT_TYPE = {
  TRAMPLING: 'TRAMPLING',
  FRONT: 'FRONT',
  SIDE: 'SIDE',
  REAR: 'REAR',
  ROLLOVER: 'ROLLOVER',
  ROTATIONAL: 'ROTATIONAL',
}

const VICTIM_POSITION_IN_VEHICLE = {
  NO_INFORMATION: 'NO_INFORMATION',
  FRONT_PASSENGER: 'FRONT_PASSENGER',
  DRIVER_OR_MOTORCYCLE_RUMP: 'DRIVER_OR_MOTORCYCLE_RUMP',
  VEHICLE_DRIVER: 'VEHICLE_DRIVER',
  REAR_PASSENGER: 'REAR_PASSENGER',
}

const SAFETY_EQUIPMENT = {
  NONE: 'NONE',
  NO_INFORMATION: 'NO_INFORMATION',
  TWO_OR_THREE_POINT_BELT: 'TWO_OR_THREE_POINT_BELT',
  HELMET_TAKEN_BY_TEAM: 'HELMET_TAKEN_BY_TEAM',
  HELMET_TAKEN_BY_OTHERS: 'HELMET_TAKEN_BY_OTHERS',
}

const VICTIM_LOCATION = {
  WITHOUT_WRECKAGE: 'WITHOUT_WRECKAGE',
  TRAPPED_IN_THE_WRECKAGE: 'TRAPPED_IN_THE_WRECKAGE',
  OUT_OF_VEHICLE: 'OUT_OF_VEHICLE',
}

const VICTIM_VEHICLE = {
  CAR: 'CAR',
  MOTORCYCLE: 'MOTORCYCLE',
  TRUCK: 'TRUCK',
  BUS: 'BUS',
  VAN: 'VAN',
  BIKE: 'BIKE',
  NO_INFORMATION: 'NO_INFORMATION',
  OTHER: 'OTHER',
  PEDESTRIAN: 'PEDESTRIAN',
  WALL_LAMPOST_TREE: 'WALL_LAMPOST_TREE',
}

const AIRWAYS = {
  FREE: 'FREE',
  TOTAL_OBSTRUCTION: 'TOTAL_OBSTRUCTION',
  GLOTTIS_EDEMA: 'GLOTTIS_EDEMA',
  STRANGE_BODY: 'STRANGE_BODY',
  SECRETION: 'SECRETION',
  PARTIAL_OBSTRUCTION: 'PARTIAL_OBSTRUCTION',
}

const BREATH = {
  SPONTANEOUS: 'SPONTANEOUS',
  EUPHONIC: 'EUPHONIC',
  APNEA: 'APNEA',
  DYSPNEA: 'DYSPNEA',
  IOT: 'IOT',
  BRANDIPNEA: 'BRANDIPNEA',
  GASPING: 'GASPING',
  TACHYPNEA: 'TACHYPNEA',
}

const PULMONARY_AUSCULTATION = {
  NORMAL: 'NORMAL',
  SNORING_WHEEZING_DE: 'SNORING_WHEEZING_DE',
  MV_DECREASED_DE: 'MV_DECREASED_DE',
  MV_ABSENT_DE: 'MV_ABSENT_DE',
  NOT_PERFORMED: 'NOT_PERFORMED',
  RALES_DE: 'RALES_DE',
}

const FINDINGS = {
  ETHYL_BREATH: 'ETHYL_BREATH',
  HEMOPTYSIS: 'HEMOPTYSIS',
  SUBCUTANEOUS_EMPHYSEMA: 'SUBCUTANEOUS_EMPHYSEMA',
  CRACKLING: 'CRACKLING',
  BLEEDING: 'BLEEDING',
  OTHER: 'OTHER',
}

const SKIN = {
  STAINED: 'STAINED',
  PALE: 'PALE',
  HOT: 'HOT',
  COLD: 'COLD',
  ICTERIC: 'ICTERIC',
  CYANOTIC: 'CYANOTIC',
  DAMP: 'DAMP',
  DRY: 'DRY',
}

const INFUSION = {
  NORMAL: 'NORMAL',
  RETARDED: 'RETARDED',
  CYANOTIC: 'CYANOTIC',
}

const HEART_AUSCULTATION = {
  NORMAL: 'NORMAL',
  BLOW: 'BLOW',
  HYPOPHONESE: 'HYPOPHONESE',
  ARRHYTHMIA: 'ARRHYTHMIA',
  UNREALIZED: 'UNREALIZED',
}

const NEUROLOGICAL_EXAMINATION = {
  NORMAL: 'NORMAL',
  SHAKING: 'SHAKING',
  CONVULSION: 'CONVULSION',
  SOMNOLENCE: 'SOMNOLENCE',
  OBNUBILATION: 'OBNUBILATION',
}

const MOTOR_DEFICIT = {
  MSD: 'MSD',
  MID: 'MID',
  MSE: 'MSE',
  MIE: 'MIE',
}

const PUPILS = {
  ISOCHORIC: 'ISOCHORIC',
  ANISOCORTICAL: 'ANISOCORTICAL',
  MYOTIC: 'MYOTIC',
  MYTRIATIC: 'MYTRIATIC',
  REACTIVE: 'REACTIVE',
  NON_REACTIVE: 'NON-REACTIVE',
}

const CONTRACTION_TYPE = {
  NO: 'NO',
  WEAK: 'WEAK',
  STRONG: 'STRONG',
  MODERATE: 'MODERATE',
}

const RN = {
  LIVE: 'LIVE',
  DEATH: 'DEATH',
  DEQUI_PLACENTA: 'DEQUI_PLACENTA',
}

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

type setFieldValue = (name: string, value: null | string | string[] | boolean) => void

const insertOrRemoveFromArray = (array: string[], setFieldValue: setFieldValue) => (
  name: string,
  value: string,
) => {
  if (array.includes(value)) {
    setFieldValue(name, array.filter(x => x !== value))
  } else {
    setFieldValue(name, array.concat(value))
  }
}

const checkOrUncheck = (oldValue: string | null, setFieldValue: setFieldValue) => (
  name: string,
  value: string,
) => {
  if (oldValue === value) {
    setFieldValue(name, null)
  } else {
    setFieldValue(name, value)
  }
}

const SectionTitle = ({ text }: { text: string }) => (
  <Typography variant='h6' style={{ marginBottom: '20px', marginTop: '20px' }}>
    {text}
  </Typography>
)

const styles = {
  tableHead: {
    backgroundColor: '#000',
    color: '#FFF',
    fontWeight: 800,
    textAlign: 'center',
  } as React.CSSProperties,
  tableCell: {
    textAlign: 'center',
  } as React.CSSProperties,
  error: {
    color: '#F00',
    fontSize: '0.8em',
  },
}

const date = new Date()

type State = {
  showSnackbar: boolean
}

export class InsertMedicalRecord extends React.PureComponent<RouteComponentProps, State> {
  state = {
    showSnackbar: false,
  }

  handleSubmit = (values: any, { setSubmitting, setStatus }: any) => {
    Service.insertMedicalRecord(values)
      .then(res => {
        this.setState({
          showSnackbar: true,
        })
        setStatus('Ficha de Atendimento registrada!')
        setSubmitting(false)
      })
      .catch(err => {
        this.setState({
          showSnackbar: true,
        })
        setStatus(err.message)
        setSubmitting(false)
      })
  }

  handleCloseSnackbar = () => {
    this.setState({
      showSnackbar: false,
    })
  }

  _generateRandom = (min: number, max: number) =>
    String(Math.floor(min + Math.random() * (max + 1 - min)))

  randomData = (setFieldValue: setFieldValue) => {
    setFieldValue('vtr', this._generateRandom(1000, 10000))
    setFieldValue('riskRating', Object.keys(RISK_RATING)[Number(this._generateRandom(0, 3))])
    setFieldValue('occurrenceNumber', this._generateRandom(10000, 30000))
    setFieldValue(
      'date',
      `${this._generateRandom(2, 29)}/${this._generateRandom(1, 10)}/${this._generateRandom(
        2018,
        2019,
      )}`,
    )
    setFieldValue('time', `${this._generateRandom(10, 20)}:${this._generateRandom(10, 50)}`)
    setFieldValue('doctor', 'Guilherme Lima')
    setFieldValue('requestReason', Object.keys(REQUEST_REASON)[Number(this._generateRandom(0, 6))])
    setFieldValue('location', LOCATION.STREET)
    setFieldValue('address', 'Rua Abdon Santana')
    setFieldValue('addressNumber', '28')
    setFieldValue('neighborhood', 'Centro')
    setFieldValue('city', 'Parnaíba')
    setFieldValue(
      'victimSituation',
      Object.keys(VICTIM_SITUATION)[Number(this._generateRandom(0, 3))],
    )
    setFieldValue('complications', Object.keys(COMPLICATIONS)[Number(this._generateRandom(0, 3))])
    setFieldValue(
      'victimName',
      `Fulano ${this._generateRandom(0, 10)} - ${this._generateRandom(10, 100)}`,
    )
    setFieldValue('victimDoc', this._generateRandom(1000000, 9000000))
    setFieldValue('victimAge', this._generateRandom(2, 70))
    setFieldValue('victimGender', Number(this._generateRandom(0, 1000000)) % 2 === 0 ? 'M' : 'F')
    setFieldValue('victimAddress', 'Avenida Nossa Senhora de Fátima')
    setFieldValue('victimAddressNeighborhood', 'Fátima')
    setFieldValue('victimAddressCity', 'Fátima')
    setFieldValue('allergy', Object.keys(ALLERGY)[Number(this._generateRandom(0, 2))])
    setFieldValue('personalBackground', [
      Object.keys(PERSONAL_BACKGROUND)[Number(this._generateRandom(0, 2))],
      Object.keys(PERSONAL_BACKGROUND)[Number(this._generateRandom(3, 5))],
      Object.keys(PERSONAL_BACKGROUND)[Number(this._generateRandom(6, 8))],
    ])
    setFieldValue('glasgowOcularOpeningAdult', this._generateRandom(1, 4))
    setFieldValue('glasgowVerbalResponseAdult', this._generateRandom(1, 5))
    setFieldValue('glasgowMotorResponseAdult', this._generateRandom(1, 6))
    setFieldValue(
      'traumaMechanism',
      Object.keys(TRAUMA_MECHANISM)[Number(this._generateRandom(1, 8))],
    )
    setFieldValue('responsive', true)
    setFieldValue('performedProcedures', [
      Object.keys(PERFORMED_PROCEDURES)[Number(this._generateRandom(0, 8))],
      Object.keys(PERFORMED_PROCEDURES)[Number(this._generateRandom(9, 18))],
    ])

    window.scrollTo(0, document.body.scrollHeight)
  }

  render() {
    return (
      <Layout match={this.props.match} history={this.props.history}>
        <Typography
          variant='h5'
          style={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}
        >
          Cadastro de Ficha de Atendimento
        </Typography>

        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={yup.object().shape({
            vtr: yup.string().required(),
            riskRating: yup.string().required(),
            occurrenceNumber: yup.string().required(),
            date: yup.string().required(),
            time: yup.string().required(),
            doctor: yup.string(),
            requestReason: yup.string().required(),
            requestReasonText: yup.string(),
            location: yup.string().required(),
            locationText: yup.string(),
            address: yup.string().required(),
            addressNumber: yup.string().required(),
            neighborhood: yup.string().required(),
            city: yup.string().required(),
            locationSituation: yup.array().of(yup.string().required()),
            victimSituation: yup.string(),
            victimSituationText: yup.string(),
            complications: yup.string(),
            numberOfVictims: yup.number(),
            otherServices: yup.bool().required(),
            otherServicesText: yup.string(),
            supportRequest: yup.array().of(yup.string().required()),
            supportRequestText: yup.string(),
            victimName: yup.string(),
            victimDoc: yup.string(),
            victimAge: yup.string(),
            victimGender: yup.string(),
            victimAddress: yup.string(),
            victimAddressNeighborhood: yup.string(),
            victimAddressCity: yup.string(),
            victimAddressPhone: yup.string(),
            companion: yup.string(),
            companionDoc: yup.string(),
            companionProximityLevel: yup.string(),
            companionPhone: yup.string(),
            initialPA: yup.string(),
            currentPA: yup.string(),
            initialFC: yup.string(),
            currentFC: yup.string(),
            initialFR: yup.string(),
            currentFR: yup.string(),
            initialDEXTRO: yup.string(),
            currentDEXTRO: yup.string(),
            initialSatO2: yup.string(),
            currentSatO2: yup.string(),
            initialTCelsius: yup.string(),
            currentTCelsius: yup.string(),
            allergy: yup.string(),
            allergyText: yup.string(),
            medicinesInUse: yup.string(),
            medicinesInUseText: yup.string(),
            personalBackground: yup.array().of(yup.string().required()),
            personalBackgroundText: yup.string(),
            glasgowOcularOpeningAdult: yup.string(),
            glasgowVerbalResponseAdult: yup.string(),
            glasgowMotorResponseAdult: yup.string(),
            glasgowOcularOpeningChild: yup.string(),
            glasgowVerbalResponseChild: yup.string(),
            glasgowMotorResponseChild: yup.string(),
            traumaMechanism: yup.string().required(),
            fallHeight: yup.string(),
            responsive: yup.bool(),
            pulse: yup.string(),
            accidentType: yup.array().of(yup.string().required()),
            victimPostionInVehicle: yup.string(),
            safetyEquipment: yup.string(),
            victimLocation: yup.string(),
            wandering: yup.bool(),
            victimVehicle: yup.string(),
            victimVehicleText: yup.string(),
            otherInvolved: yup.string(),
            airways: yup.string(),
            secretionText: yup.string(),
            breath: yup.array().of(yup.string().required()),
            pulmonaryAuscultation: yup.array().of(yup.string().required()),
            findings: yup.array().of(yup.string().required()),
            findingsText: yup.string(),
            skin: yup.array().of(yup.string().required()),
            infusion: yup.string(),
            heartAuscultation: yup.array().of(yup.string().required()),
            neurologicalExamination: yup.array().of(yup.string().required()),
            aphasia: yup.bool(),
            otorrhagia: yup.array().of(yup.string().required()),
            racoonEyes: yup.array().of(yup.string().required()),
            battle: yup.array().of(yup.string().required()),
            motorDeficit: yup.array().of(yup.string().required()),
            stiffNeck: yup.bool(),
            pupils: yup.array().of(yup.string().required()),
            obstetricsG: yup.string(),
            obstetricsP: yup.string(),
            obstetricsA: yup.string(),
            obstetricsIG: yup.string(),
            labour: yup.bool(),
            contractions: yup.bool(),
            contractionType: yup.string(),
            contractionNumber: yup.string(),
            contractionMin: yup.string(),
            amnioticSacBroke: yup.bool(),
            touchCm: yup.string(),
            abortion: yup.bool(),
            vaginalBleeding: yup.bool(),
            rn: yup.array().of(yup.string().required()),
            firstApgar: yup.string(),
            secondApgar: yup.string(),
            physicalExaminationFindingsHead: yup.string(),
            physicalExaminationFindingsNeck: yup.string(),
            physicalExaminationFindingsChest: yup.string(),
            physicalExaminationFindingsAbdomen: yup.string(),
            physicalExaminationFindingsPelvis: yup.string(),
            physicalExaminationFindingsExtremities: yup.string(),
            performedProcedures: yup.array().of(yup.string().required()),
          })}
          initialValues={{
            vtr: '',
            riskRating: RISK_RATING.GREEN,
            occurrenceNumber: '',
            date: dateFns.format(date, 'DD/MM/YYYY'),
            time: dateFns.format(date, 'HH:MM'),
            doctor: '',
            requestReason: REQUEST_REASON.CLINICAL,
            requestReasonText: '',
            location: LOCATION.STREET,
            locationText: '',
            address: '',
            addressNumber: '',
            neighborhood: '',
            city: '',
            locationSituation: [] as string[],
            victimSituation: '',
            victimSituationText: '',
            complications: '',
            numberOfVictims: 1,
            otherServices: false,
            otherServicesText: '',
            supportRequest: [] as string[],
            supportRequestText: '',
            victimName: '',
            victimDoc: '',
            victimAge: '',
            victimGender: 'U',
            victimAddress: '',
            victimAddressNeighborhood: '',
            victimAddressCity: '',
            victimAddressPhone: '',
            companion: '',
            companionDoc: '',
            companionProximityLevel: '',
            companionPhone: '',
            initialPA: '',
            currentPA: '',
            initialFC: '',
            currentFC: '',
            initialFR: '',
            currentFR: '',
            initialDEXTRO: '',
            currentDEXTRO: '',
            initialSatO2: '',
            currentSatO2: '',
            initialTCelsius: '',
            currentTCelsius: '',
            allergy: ALLERGY.DENY,
            allergyText: '',
            medicinesInUse: ALLERGY.DENY,
            medicinesInUseText: '',
            personalBackground: [] as string[],
            personalBackgroundText: '',
            glasgowOcularOpeningAdult: '0',
            glasgowVerbalResponseAdult: '0',
            glasgowMotorResponseAdult: '0',
            glasgowOcularOpeningChild: '0',
            glasgowVerbalResponseChild: '0',
            glasgowMotorResponseChild: '0',
            traumaMechanism: '',
            fallHeight: '',
            responsive: false,
            pulse: PULSE.REGULAR,
            accidentType: [] as string[],
            victimPostionInVehicle: '',
            safetyEquipment: '',
            victimLocation: '',
            wandering: false,
            victimVehicle: '',
            victimVehicleText: '',
            otherInvolved: '',
            airways: '',
            secretionText: '',
            breath: [] as string[],
            pulmonaryAuscultation: [] as string[],
            findings: [] as string[],
            findingsText: '',
            skin: [] as string[],
            infusion: '',
            heartAuscultation: [] as string[],
            neurologicalExamination: [] as string[],
            aphasia: false,
            otorrhagia: [] as string[],
            racoonEyes: [] as string[],
            battle: [] as string[],
            motorDeficit: [] as string[],
            stiffNeck: false,
            pupils: [] as string[],
            obstetricsG: '',
            obstetricsP: '',
            obstetricsA: '',
            obstetricsIG: '',
            labour: false,
            contractions: false,
            contractionType: '',
            contractionNumber: '',
            contractionMin: '',
            amnioticSacBroke: false,
            touchCm: '',
            abortion: false,
            vaginalBleeding: false,
            rn: [] as string[],
            firstApgar: '',
            secondApgar: '',
            physicalExaminationFindingsHead: '',
            physicalExaminationFindingsNeck: '',
            physicalExaminationFindingsChest: '',
            physicalExaminationFindingsAbdomen: '',
            physicalExaminationFindingsPelvis: '',
            physicalExaminationFindingsExtremities: '',
            performedProcedures: [] as string[],
          }}
          onSubmit={this.handleSubmit}
        >
          {({ values, errors, isSubmitting, setFieldValue, handleSubmit, status }) => (
            <>
              <Button
                type='submit'
                fullWidth
                variant='outlined'
                style={{ alignSelf: 'flex-end' }}
                onClick={evt => this.randomData(setFieldValue)}
                disabled={isSubmitting}
                id='generate-random-data-button'
              >
                Gerar Dados Aleatoriamente
              </Button>
              <Snackbar
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                open={this.state.showSnackbar}
                autoHideDuration={4000}
                onClose={this.handleCloseSnackbar}
                message={status}
              />
              <SectionTitle text='Informações Gerais' />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={4} md={2}>
                  <TextInput
                    name='vtr'
                    label='VTR'
                    value={values.vtr}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Select
                    label='Classificação de Risco'
                    name='riskRating'
                    value={values.riskRating}
                    handleChange={setFieldValue}
                    options={[
                      { label: 'Verde', value: RISK_RATING.GREEN },
                      { label: 'Amarelo', value: RISK_RATING.YELLOW },
                      { label: 'Vermelho', value: RISK_RATING.RED },
                      { label: 'Cinza', value: RISK_RATING.GREY },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <TextInput
                    name='occurrenceNumber'
                    label='Número da Ocorrência'
                    value={values.occurrenceNumber}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <MaskTextInput
                    name='date'
                    label='Data'
                    placeholder='DD/MM/YYYY'
                    value={values.date}
                    handleChange={setFieldValue}
                    errors={errors}
                    mask='99/99/9999'
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextInput
                    name='time'
                    label='Hora'
                    placeholder='DD/MM/YYYY'
                    value={values.time}
                    handleChange={setFieldValue}
                    errors={errors}
                    type='time'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextInput
                    name='doctor'
                    label='Médico Regulador'
                    value={values.doctor}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Select
                    label='Motivo da Solicitação'
                    name='requestReason'
                    value={values.requestReason}
                    handleChange={setFieldValue}
                    options={[
                      { label: 'Clínico', value: REQUEST_REASON.CLINICAL },
                      { label: 'Cirúrgico', value: REQUEST_REASON.SURGICAL },
                      { label: 'Obstétrico', value: REQUEST_REASON.OBSTETRIC },
                      { label: 'Psiquiátrico', value: REQUEST_REASON.PSYCHIATRIC },
                      { label: 'Pediátrico', value: REQUEST_REASON.PEDIATRIC },
                      {
                        label: 'Transporte inter-hospitalar',
                        value: REQUEST_REASON.INTERHOSPITAL_TRANSPORT,
                      },
                      { label: 'Outros', value: REQUEST_REASON.OTHER },
                    ]}
                  />
                </Grid>
                {values.requestReason === REQUEST_REASON.OTHER && (
                  <Grid item xs={12} sm={3}>
                    <TextInput
                      name='requestReasonText'
                      label='Outro motivo de solicitação?'
                      value={values.requestReasonText}
                      handleChange={setFieldValue}
                      errors={errors}
                    />
                  </Grid>
                )}
              </Grid>
              <SectionTitle text='Local da Ocorrência' />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={2}>
                  <Select
                    label='Local da Ocorrência'
                    name='location'
                    value={values.location}
                    handleChange={setFieldValue}
                    options={[
                      { label: 'Via pública', value: LOCATION.STREET },
                      { label: 'Espaço Público', value: LOCATION.PUBLIC_PLACE },
                      { label: 'Residência', value: LOCATION.RESIDENCE },
                      { label: 'Rodovia', value: LOCATION.HIGHWAY },
                      { label: 'Outro', value: LOCATION.OTHER },
                    ]}
                  />
                </Grid>
                {values.location === LOCATION.OTHER && (
                  <Grid item xs={12} sm={3}>
                    <TextInput
                      name='locationText'
                      label='Outra localizacão?'
                      value={values.locationText}
                      handleChange={setFieldValue}
                      errors={errors}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={values.location === LOCATION.OTHER ? 7 : 10}>
                  <TextInput
                    name='address'
                    label='Endereço'
                    value={values.address}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextInput
                    name='addressNumber'
                    label='Número'
                    value={values.addressNumber}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='neighborhood'
                    label='Bairro'
                    value={values.neighborhood}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextInput
                    name='city'
                    label='Cidade'
                    value={values.city}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
              </Grid>
              <SectionTitle text='Situação do Local' />
              <Checkbox
                name='locationSituation'
                label='Cena segura'
                checked={values.locationSituation.includes(LOCATION_SITUATION.SAFE_SCENE)}
                value={LOCATION_SITUATION.SAFE_SCENE}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Cena insegura'
                checked={values.locationSituation.includes(LOCATION_SITUATION.UNSAFE_SCENE)}
                value={LOCATION_SITUATION.UNSAFE_SCENE}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Difícil Acesso'
                checked={values.locationSituation.includes(LOCATION_SITUATION.HARD_ACCESS)}
                value={LOCATION_SITUATION.HARD_ACCESS}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Animais oferecem risco'
                checked={values.locationSituation.includes(LOCATION_SITUATION.ANIMALS_RISK)}
                value={LOCATION_SITUATION.ANIMALS_RISK}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Rua sem identificação'
                checked={values.locationSituation.includes(LOCATION_SITUATION.UNIDENTIFIED_STREET)}
                value={LOCATION_SITUATION.UNIDENTIFIED_STREET}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Incêndio'
                checked={values.locationSituation.includes(LOCATION_SITUATION.FIRE)}
                value={LOCATION_SITUATION.FIRE}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Produto Perigoso'
                checked={values.locationSituation.includes(LOCATION_SITUATION.DANGEROUS_PRODUCT)}
                value={LOCATION_SITUATION.DANGEROUS_PRODUCT}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Aglomeração'
                checked={values.locationSituation.includes(LOCATION_SITUATION.CROWDING)}
                value={LOCATION_SITUATION.CROWDING}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Terceiros oferecem risco'
                checked={values.locationSituation.includes(LOCATION_SITUATION.THIRD_PARTIES_RISK)}
                value={LOCATION_SITUATION.THIRD_PARTIES_RISK}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <Checkbox
                name='locationSituation'
                label='Óleo na via'
                checked={values.locationSituation.includes(LOCATION_SITUATION.OIL_ON_THE_ROAD)}
                value={LOCATION_SITUATION.OIL_ON_THE_ROAD}
                handleChange={insertOrRemoveFromArray(values.locationSituation, setFieldValue)}
                extraData={values.locationSituation}
              />
              <SectionTitle text='Situação da Vítima' />
              <Checkbox
                name='victimSituation'
                label='Evasão'
                checked={values.victimSituation === VICTIM_SITUATION.EVASION}
                value={VICTIM_SITUATION.EVASION}
                handleChange={checkOrUncheck(values.victimSituation, setFieldValue)}
              />
              <Checkbox
                name='victimSituation'
                label='Não localizada'
                checked={values.victimSituation === VICTIM_SITUATION.NOT_LOCALIZED}
                value={VICTIM_SITUATION.NOT_LOCALIZED}
                handleChange={checkOrUncheck(values.victimSituation, setFieldValue)}
              />
              <Checkbox
                name='victimSituation'
                label='Vítima Agressiva'
                checked={values.victimSituation === VICTIM_SITUATION.AGGRESSIVE}
                value={VICTIM_SITUATION.AGGRESSIVE}
                handleChange={checkOrUncheck(values.victimSituation, setFieldValue)}
              />
              <Checkbox
                name='victimSituation'
                label='Presa às ferragens'
                checked={values.victimSituation === VICTIM_SITUATION.TRAPPED_IN_THE_WRECKAGE}
                value={VICTIM_SITUATION.TRAPPED_IN_THE_WRECKAGE}
                handleChange={checkOrUncheck(values.victimSituation, setFieldValue)}
              />
              <Checkbox
                name='victimSituation'
                label='Outros'
                checked={values.victimSituation === VICTIM_SITUATION.OTHER}
                value={VICTIM_SITUATION.OTHER}
                handleChange={checkOrUncheck(values.victimSituation, setFieldValue)}
              />
              {values.victimSituation === VICTIM_SITUATION.OTHER && (
                <TextInput
                  name='victimSituationText'
                  label='Situação da vítima'
                  value={values.victimSituationText}
                  handleChange={setFieldValue}
                  errors={errors}
                />
              )}
              <SectionTitle text='Intercorrências' />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={2}>
                  <Checkbox
                    name='complications'
                    label='QTA no Local'
                    checked={values.complications === COMPLICATIONS.QTA_ON_LOCAL}
                    value={COMPLICATIONS.QTA_ON_LOCAL}
                    handleChange={checkOrUncheck(values.complications, setFieldValue)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Checkbox
                    name='complications'
                    label='QTA no Trajeto'
                    checked={values.complications === COMPLICATIONS.QTA_ON_THE_WAY}
                    value={COMPLICATIONS.QTA_ON_THE_WAY}
                    handleChange={checkOrUncheck(values.complications, setFieldValue)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Checkbox
                    name='complications'
                    label='Chamado Falso'
                    checked={values.complications === COMPLICATIONS.FALSE_CALL}
                    value={COMPLICATIONS.FALSE_CALL}
                    handleChange={checkOrUncheck(values.complications, setFieldValue)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Checkbox
                    name='complications'
                    label='Múltiplas Vítimas'
                    checked={values.complications === COMPLICATIONS.MULTIPLE_VICTIMS}
                    value={COMPLICATIONS.MULTIPLE_VICTIMS}
                    handleChange={checkOrUncheck(values.complications, setFieldValue)}
                  />
                </Grid>
                {values.complications === COMPLICATIONS.MULTIPLE_VICTIMS && (
                  <Grid item xs={12} sm={4}>
                    <TextInput
                      name='numberOfVictims'
                      label='Número de vítimas'
                      value={String(values.numberOfVictims)}
                      handleChange={setFieldValue}
                      errors={errors}
                      type='number'
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <SectionTitle text='Outros serviços no local' />
                  <Checkbox
                    name='otherServices'
                    label='Outros serviços no local?'
                    checked={values.otherServices}
                    handleChange={name => setFieldValue(name, !values.otherServices)}
                  />
                  {values.otherServices && (
                    <TextInput
                      name='otherServicesText'
                      label='Quais?'
                      value={values.otherServicesText}
                      handleChange={setFieldValue}
                      errors={errors}
                      type='number'
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SectionTitle text='Solicitação de Apoio' />
                  <Checkbox
                    name='supportRequest'
                    label='Não'
                    checked={values.supportRequest.includes(SUPPORT_REQUEST.NO)}
                    value={SUPPORT_REQUEST.NO}
                    handleChange={(name, value) => {
                      if (values.supportRequest.includes(value)) {
                        setFieldValue(
                          'supportRequest',
                          values.supportRequest.filter(x => x !== SUPPORT_REQUEST.NO),
                        )
                      } else {
                        setFieldValue('supportRequest', [SUPPORT_REQUEST.NO])
                      }
                    }}
                    extraData={values.supportRequest}
                  />
                  <Checkbox
                    name='supportRequest'
                    label='USA'
                    checked={values.supportRequest.includes(SUPPORT_REQUEST.USA)}
                    value={SUPPORT_REQUEST.USA}
                    handleChange={(name, value) =>
                      insertOrRemoveFromArray(
                        values.supportRequest.filter(x => x !== SUPPORT_REQUEST.NO),
                        setFieldValue,
                      )(name, value)
                    }
                    extraData={values.supportRequest}
                  />
                  <Checkbox
                    name='supportRequest'
                    label='USB'
                    checked={values.supportRequest.includes(SUPPORT_REQUEST.USB)}
                    value={SUPPORT_REQUEST.USB}
                    handleChange={(name, value) =>
                      insertOrRemoveFromArray(
                        values.supportRequest.filter(x => x !== SUPPORT_REQUEST.NO),
                        setFieldValue,
                      )(name, value)
                    }
                    extraData={values.supportRequest}
                  />
                  <Checkbox
                    name='supportRequest'
                    label='190'
                    checked={values.supportRequest.includes(SUPPORT_REQUEST[190])}
                    value={SUPPORT_REQUEST[190]}
                    handleChange={(name, value) =>
                      insertOrRemoveFromArray(
                        values.supportRequest.filter(x => x !== SUPPORT_REQUEST.NO),
                        setFieldValue,
                      )(name, value)
                    }
                    extraData={values.supportRequest}
                  />
                  <Checkbox
                    name='supportRequest'
                    label='193'
                    checked={values.supportRequest.includes(SUPPORT_REQUEST[193])}
                    value={SUPPORT_REQUEST[193]}
                    handleChange={(name, value) =>
                      insertOrRemoveFromArray(
                        values.supportRequest.filter(x => x !== SUPPORT_REQUEST.NO),
                        setFieldValue,
                      )(name, value)
                    }
                    extraData={values.supportRequest}
                  />
                  <Checkbox
                    name='supportRequest'
                    label='Outros?'
                    checked={values.supportRequest.includes(SUPPORT_REQUEST.OTHER)}
                    value={SUPPORT_REQUEST.OTHER}
                    handleChange={(name, value) =>
                      insertOrRemoveFromArray(
                        values.supportRequest.filter(x => x !== SUPPORT_REQUEST.NO),
                        setFieldValue,
                      )(name, value)
                    }
                    extraData={values.supportRequest}
                  />
                  {values.supportRequest.includes(SUPPORT_REQUEST.OTHER) && (
                    <TextInput
                      name='supportRequestText'
                      label='Quais outros serviços foram chamados?'
                      value={values.supportRequestText}
                      handleChange={setFieldValue}
                      errors={errors}
                    />
                  )}
                </Grid>
              </Grid>
              <SectionTitle text='Dados da vítima' />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='victimName'
                    label='Nome'
                    value={values.victimName}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextInput
                    name='victimDoc'
                    label='Documento'
                    value={values.victimDoc}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextInput
                    name='victimAge'
                    label='Idade'
                    value={values.victimAge}
                    handleChange={setFieldValue}
                    errors={errors}
                    type='number'
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Select
                    label='Sexo'
                    name='victimGender'
                    value={values.victimGender}
                    handleChange={setFieldValue}
                    options={[
                      { label: 'Masculino', value: 'M' },
                      { label: 'Feminino', value: 'F' },
                      { label: 'Não informado', value: 'U' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='victimAddress'
                    label='Endereço'
                    value={values.victimAddress}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextInput
                    name='victimAddressNeighborhood'
                    label='Bairro'
                    value={values.victimAddressNeighborhood}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextInput
                    name='victimAddressCity'
                    label='Cidade'
                    value={values.victimAddressCity}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <MaskTextInput
                    name='victimAddressPhone'
                    label='Telefone'
                    value={values.victimAddressPhone}
                    handleChange={setFieldValue}
                    errors={errors}
                    mask='(99) 9 9999-9999'
                    placeholder='(99) 9 9999-9999'
                  />
                </Grid>
                <Grid item xs={12} sm={7}>
                  <TextInput
                    name='companion'
                    label='Nome do Acompanhante'
                    value={values.companion}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextInput
                    name='companionDoc'
                    label='Documento do Acompanhante'
                    value={values.companionDoc}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextInput
                    name='companionProximityLevel'
                    label='Grau de apromixação'
                    value={values.companionProximityLevel}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <MaskTextInput
                    name='companionPhone'
                    label='Telefone do Acompanhante'
                    value={values.companionPhone}
                    handleChange={setFieldValue}
                    errors={errors}
                    mask='(99) 9 9999-9999'
                    placeholder='(99) 9 9999-9999'
                  />
                </Grid>
              </Grid>
              <Table style={{ marginTop: '10px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={styles.tableHead}> </TableCell>
                    <TableCell style={styles.tableHead}>Inicial</TableCell>
                    <TableCell style={styles.tableHead}>Atual</TableCell>
                    <TableCell style={styles.tableHead}> </TableCell>
                    <TableCell style={styles.tableHead}>Inicial</TableCell>
                    <TableCell style={styles.tableHead}>Atual</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>PA:</TableCell>
                    <TableCell>
                      <TextInput
                        name='initialPA'
                        label=''
                        value={values.initialPA}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        name='currentPA'
                        label=''
                        value={values.currentPA}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>DEXTRO</TableCell>
                    <TableCell>
                      <TextInput
                        name='initialDEXTRO'
                        label=''
                        value={values.initialDEXTRO}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        name='currentDEXTRO'
                        label=''
                        value={values.currentDEXTRO}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FC:</TableCell>
                    <TableCell>
                      <TextInput
                        name='initialFC'
                        label=''
                        value={values.initialFC}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        name='currentFC'
                        label=''
                        value={values.currentFC}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>Sat.O2%:</TableCell>
                    <TableCell>
                      <TextInput
                        name='initialSatO2'
                        label=''
                        value={values.initialSatO2}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        name='currentSatO2'
                        label=''
                        value={values.currentSatO2}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>FR:</TableCell>
                    <TableCell>
                      <TextInput
                        name='initialFR'
                        label=''
                        value={values.initialFR}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        name='currentFR'
                        label=''
                        value={values.currentFR}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>T °C</TableCell>
                    <TableCell>
                      <TextInput
                        name='initialTCelsius'
                        label=''
                        value={values.initialTCelsius}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                    <TableCell>
                      <TextInput
                        name='currentTCelsius'
                        label=''
                        value={values.currentTCelsius}
                        handleChange={setFieldValue}
                        errors={errors}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <SectionTitle text='Alergias' />
              <Checkbox
                name='allergy'
                label='Nega'
                checked={values.allergy === ALLERGY.DENY}
                value={ALLERGY.DENY}
                handleChange={checkOrUncheck(values.allergy, setFieldValue)}
              />
              <Checkbox
                name='allergy'
                label='Não informado'
                checked={values.allergy === ALLERGY.UNINFORMED}
                value={ALLERGY.UNINFORMED}
                handleChange={checkOrUncheck(values.allergy, setFieldValue)}
              />
              <Checkbox
                name='allergy'
                label='Sem condições de informar'
                checked={values.allergy === ALLERGY.CANT_INFORM}
                value={ALLERGY.CANT_INFORM}
                handleChange={checkOrUncheck(values.allergy, setFieldValue)}
              />
              <Checkbox
                name='allergy'
                label='Sim'
                checked={values.allergy === ALLERGY.YES}
                value={ALLERGY.YES}
                handleChange={checkOrUncheck(values.allergy, setFieldValue)}
              />
              {values.allergy === ALLERGY.YES && (
                <TextInput
                  name='allergyText'
                  label='Quais?'
                  value={values.allergyText}
                  handleChange={setFieldValue}
                  errors={errors}
                />
              )}
              <SectionTitle text='Medicamentos em uso' />
              <Checkbox
                name='medicinesInUse'
                label='Nega'
                checked={values.medicinesInUse === MEDICINES_IN_USE.DENY}
                value={MEDICINES_IN_USE.DENY}
                handleChange={checkOrUncheck(values.medicinesInUse, setFieldValue)}
              />
              <Checkbox
                name='medicinesInUse'
                label='Não informado'
                checked={values.medicinesInUse === MEDICINES_IN_USE.UNINFORMED}
                value={MEDICINES_IN_USE.UNINFORMED}
                handleChange={checkOrUncheck(values.medicinesInUse, setFieldValue)}
              />
              <Checkbox
                name='medicinesInUse'
                label='Sem condições de informar'
                checked={values.medicinesInUse === MEDICINES_IN_USE.CANT_INFORM}
                value={MEDICINES_IN_USE.CANT_INFORM}
                handleChange={checkOrUncheck(values.medicinesInUse, setFieldValue)}
              />
              <Checkbox
                name='medicinesInUse'
                label='Sim'
                checked={values.medicinesInUse === MEDICINES_IN_USE.YES}
                value={MEDICINES_IN_USE.YES}
                handleChange={checkOrUncheck(values.medicinesInUse, setFieldValue)}
              />
              {values.medicinesInUse === MEDICINES_IN_USE.YES && (
                <TextInput
                  name='medicinesInUseText'
                  label='Quais?'
                  value={values.medicinesInUseText}
                  handleChange={setFieldValue}
                  errors={errors}
                />
              )}
              <SectionTitle text='Antecedentes Pessoais' />
              <Checkbox
                name='personalBackground'
                label='HAS'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.HAS)}
                value={PERSONAL_BACKGROUND.HAS}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='Cardiopata'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.HEART_DISEASE)}
                value={PERSONAL_BACKGROUND.HEART_DISEASE}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='IAM anterior'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.PREVIOUS_IAM)}
                value={PERSONAL_BACKGROUND.PREVIOUS_IAM}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='AVE anterior'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.PREVIOUS_AVE)}
                value={PERSONAL_BACKGROUND.PREVIOUS_AVE}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='Convulsões'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.CONVULSIONS)}
                value={PERSONAL_BACKGROUND.CONVULSIONS}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='Diabetes'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.DIABETES)}
                value={PERSONAL_BACKGROUND.DIABETES}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='Cirúrgico'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.SURGICAL)}
                value={PERSONAL_BACKGROUND.SURGICAL}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='Asma/Bronquite/DPOC'
                checked={values.personalBackground.includes(
                  PERSONAL_BACKGROUND.ASTHMA_BRONCHITIS_DPOC,
                )}
                value={PERSONAL_BACKGROUND.ASTHMA_BRONCHITIS_DPOC}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='Nega tratamento anterior ou atual'
                checked={values.personalBackground.includes(
                  PERSONAL_BACKGROUND.DENY_PREVIOUS_TREATMENT,
                )}
                value={PERSONAL_BACKGROUND.DENY_PREVIOUS_TREATMENT}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='Sem condições de informar'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.CANT_INFORM)}
                value={PERSONAL_BACKGROUND.CANT_INFORM}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              <Checkbox
                name='personalBackground'
                label='Outros'
                checked={values.personalBackground.includes(PERSONAL_BACKGROUND.OTHER)}
                value={PERSONAL_BACKGROUND.OTHER}
                handleChange={insertOrRemoveFromArray(values.personalBackground, setFieldValue)}
                extraData={values.personalBackground}
              />
              {values.personalBackground.includes(PERSONAL_BACKGROUND.OTHER) && (
                <TextInput
                  name='personalBackgroundText'
                  label='Quais?'
                  value={values.personalBackgroundText}
                  handleChange={setFieldValue}
                  errors={errors}
                />
              )}
              <Table style={{ marginTop: '10px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={styles.tableHead} />
                    <TableCell style={styles.tableHead}>ESCALA DE GLASGOW ADULTO</TableCell>
                    <TableCell
                      style={{
                        ...styles.tableHead,
                        borderRightColor: '#FFF',
                        borderRightWidth: '2px',
                        borderRightStyle: 'solid',
                      }}
                    />
                    <TableCell style={styles.tableHead} />
                    <TableCell style={styles.tableHead}>ESCALA DE GLASGOW 0 A 2 ANOS</TableCell>
                    <TableCell style={styles.tableHead} />
                  </TableRow>
                  <TableRow>
                    <TableCell style={styles.tableCell}>Abertura Ocular</TableCell>
                    <TableCell style={styles.tableCell}>Resposta Verbal</TableCell>
                    <TableCell style={styles.tableCell}>Resposta Motora</TableCell>
                    <TableCell style={styles.tableCell}>Abertura Ocular</TableCell>
                    <TableCell style={styles.tableCell}>Resposta Verbal</TableCell>
                    <TableCell style={styles.tableCell}>Resposta Motora</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        name='glasgowOcularOpeningAdult'
                        label='4 - espontânea'
                        handleChange={checkOrUncheck(
                          values.glasgowOcularOpeningAdult,
                          setFieldValue,
                        )}
                        value={'4'}
                        checked={values.glasgowOcularOpeningAdult === '4'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseAdult'
                        label='5 - orientada'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseAdult,
                          setFieldValue,
                        )}
                        value={'5'}
                        checked={values.glasgowVerbalResponseAdult === '5'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseAdult'
                        label='6 - obedece a comandos'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseAdult,
                          setFieldValue,
                        )}
                        value={'6'}
                        checked={values.glasgowMotorResponseAdult === '6'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowOcularOpeningChild'
                        label='4 - espontânea'
                        handleChange={checkOrUncheck(
                          values.glasgowOcularOpeningChild,
                          setFieldValue,
                        )}
                        value={'4'}
                        checked={values.glasgowOcularOpeningChild === '4'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseChild'
                        label='5 - orientado/arrulha'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseChild,
                          setFieldValue,
                        )}
                        value={'5'}
                        checked={values.glasgowVerbalResponseChild === '5'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseChild'
                        label='6 - obedece a comando verbal/movimento espotâneo'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseChild,
                          setFieldValue,
                        )}
                        value={'6'}
                        checked={values.glasgowMotorResponseChild === '6'}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        name='glasgowOcularOpeningAdult'
                        label='3 - a voz'
                        handleChange={checkOrUncheck(
                          values.glasgowOcularOpeningAdult,
                          setFieldValue,
                        )}
                        value={'3'}
                        checked={values.glasgowOcularOpeningAdult === '3'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseAdult'
                        label='4 - confuso'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseAdult,
                          setFieldValue,
                        )}
                        value={'4'}
                        checked={values.glasgowVerbalResponseAdult === '4'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseAdult'
                        label='5 - localiza a dor'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseAdult,
                          setFieldValue,
                        )}
                        value={'5'}
                        checked={values.glasgowMotorResponseAdult === '5'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowOcularOpeningChild'
                        label='3 - a voz'
                        handleChange={checkOrUncheck(
                          values.glasgowOcularOpeningChild,
                          setFieldValue,
                        )}
                        value={'3'}
                        checked={values.glasgowOcularOpeningChild === '3'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseChild'
                        label='4 - confuso/inquite, irritado e choroso'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseChild,
                          setFieldValue,
                        )}
                        value={'4'}
                        checked={values.glasgowVerbalResponseChild === '4'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseChild'
                        label='5 - localiza a dor/retira o membro ao toque'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseChild,
                          setFieldValue,
                        )}
                        value={'5'}
                        checked={values.glasgowMotorResponseChild === '5'}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        name='glasgowOcularOpeningAdult'
                        label='2 - a dor'
                        handleChange={checkOrUncheck(
                          values.glasgowOcularOpeningAdult,
                          setFieldValue,
                        )}
                        value={'2'}
                        checked={values.glasgowOcularOpeningAdult === '2'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseAdult'
                        label='3 - palavras inapropriadas'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseAdult,
                          setFieldValue,
                        )}
                        value={'3'}
                        checked={values.glasgowVerbalResponseAdult === '3'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseAdult'
                        label='4 - retira a dor'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseAdult,
                          setFieldValue,
                        )}
                        value={'4'}
                        checked={values.glasgowMotorResponseAdult === '4'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowOcularOpeningChild'
                        label='2 - a dor'
                        handleChange={checkOrUncheck(
                          values.glasgowOcularOpeningChild,
                          setFieldValue,
                        )}
                        value={'2'}
                        checked={values.glasgowOcularOpeningChild === '2'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseChild'
                        label='3 - palavras inapropriadas/chora em resposta a dor'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseChild,
                          setFieldValue,
                        )}
                        value={'3'}
                        checked={values.glasgowVerbalResponseChild === '3'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseChild'
                        label='4 - retira membro a dor'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseChild,
                          setFieldValue,
                        )}
                        value={'4'}
                        checked={values.glasgowMotorResponseChild === '4'}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        name='glasgowOcularOpeningAdult'
                        label='1 - ausente'
                        handleChange={checkOrUncheck(
                          values.glasgowOcularOpeningAdult,
                          setFieldValue,
                        )}
                        value={'1'}
                        checked={values.glasgowOcularOpeningAdult === '1'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseAdult'
                        label='2 - sons/gemidos'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseAdult,
                          setFieldValue,
                        )}
                        value={'2'}
                        checked={values.glasgowVerbalResponseAdult === '2'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseAdult'
                        label='3 - flexão normal'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseAdult,
                          setFieldValue,
                        )}
                        value={'3'}
                        checked={values.glasgowMotorResponseAdult === '3'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowOcularOpeningChild'
                        label='1 - sem resposta'
                        handleChange={checkOrUncheck(
                          values.glasgowOcularOpeningChild,
                          setFieldValue,
                        )}
                        value={'1'}
                        checked={values.glasgowOcularOpeningChild === '1'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseChild'
                        label='2 - sons inespecíficos/geme em resposta a dor'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseChild,
                          setFieldValue,
                        )}
                        value={'2'}
                        checked={values.glasgowVerbalResponseChild === '2'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseChild'
                        label='3 - decorticação'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseChild,
                          setFieldValue,
                        )}
                        value={'3'}
                        checked={values.glasgowMotorResponseChild === '3'}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseAdult'
                        label='1 - ausente'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseAdult,
                          setFieldValue,
                        )}
                        value={'1'}
                        checked={values.glasgowVerbalResponseAdult === '1'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseAdult'
                        label='2 - sons/gemidos'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseAdult,
                          setFieldValue,
                        )}
                        value={'2'}
                        checked={values.glasgowMotorResponseAdult === '2'}
                      />
                    </TableCell>
                    <TableCell />
                    <TableCell>
                      <Checkbox
                        name='glasgowVerbalResponseChild'
                        label='1 - sem resposta'
                        handleChange={checkOrUncheck(
                          values.glasgowVerbalResponseChild,
                          setFieldValue,
                        )}
                        value={'1'}
                        checked={values.glasgowVerbalResponseChild === '1'}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseChild'
                        label='2 - descerebração'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseChild,
                          setFieldValue,
                        )}
                        value={'2'}
                        checked={values.glasgowMotorResponseChild === '2'}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseAdult'
                        label='1 - ausente'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseAdult,
                          setFieldValue,
                        )}
                        value={'1'}
                        checked={values.glasgowMotorResponseAdult === '1'}
                      />
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                      <Checkbox
                        name='glasgowMotorResponseChild'
                        label='1 - sem resposta'
                        handleChange={checkOrUncheck(
                          values.glasgowMotorResponseChild,
                          setFieldValue,
                        )}
                        value={'1'}
                        checked={values.glasgowMotorResponseChild === '1'}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TOTAL:</TableCell>
                    <TableCell />
                    <TableCell>
                      {values.glasgowVerbalResponseAdult &&
                      values.glasgowOcularOpeningAdult &&
                      values.glasgowMotorResponseAdult
                        ? Number(values.glasgowVerbalResponseAdult) +
                          Number(values.glasgowOcularOpeningAdult) +
                          Number(values.glasgowMotorResponseAdult)
                        : 0}
                    </TableCell>
                    <TableCell>TOTAL:</TableCell>
                    <TableCell />
                    <TableCell>
                      {values.glasgowVerbalResponseChild &&
                      values.glasgowOcularOpeningChild &&
                      values.glasgowMotorResponseChild
                        ? Number(values.glasgowVerbalResponseChild) +
                          Number(values.glasgowOcularOpeningChild) +
                          Number(values.glasgowMotorResponseChild)
                        : 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <SectionTitle text='Mecanismo do Trauma' />
              {errors.traumaMechanism && (
                <Typography variant='caption' style={styles.error}>
                  Campo necessário
                </Typography>
              )}
              <Checkbox
                name='traumaMechanism'
                label='Não se aplica'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.NOT_APPLICABLE}
                value={TRAUMA_MECHANISM.NOT_APPLICABLE}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              <Checkbox
                name='traumaMechanism'
                label='Acidente de Trânsito'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.TRAFFIC_ACCIDENT}
                value={TRAUMA_MECHANISM.TRAFFIC_ACCIDENT}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              <Checkbox
                name='traumaMechanism'
                label='Encravamento'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.INTERLOCKING}
                value={TRAUMA_MECHANISM.INTERLOCKING}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              <Checkbox
                name='traumaMechanism'
                label='Queda própria altura'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.FALL_OWN_HEIGHT}
                value={TRAUMA_MECHANISM.FALL_OWN_HEIGHT}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              <Checkbox
                name='traumaMechanism'
                label='FAB'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.FAB}
                value={TRAUMA_MECHANISM.FAB}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              <Checkbox
                name='traumaMechanism'
                label='FPAF'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.FPAF}
                value={TRAUMA_MECHANISM.FPAF}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              <Checkbox
                name='traumaMechanism'
                label='Queimadura'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.BURN}
                value={TRAUMA_MECHANISM.BURN}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              <Checkbox
                name='traumaMechanism'
                label='Agressão'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.AGGRESSION}
                value={TRAUMA_MECHANISM.AGGRESSION}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              <Checkbox
                name='traumaMechanism'
                label='Queda'
                checked={values.traumaMechanism === TRAUMA_MECHANISM.FALL}
                value={TRAUMA_MECHANISM.FALL}
                handleChange={checkOrUncheck(values.traumaMechanism, setFieldValue)}
              />
              {values.traumaMechanism === TRAUMA_MECHANISM.FALL && (
                <TextInput
                  name='fallHeight'
                  label='Qual altura da queda? (em metros)'
                  value={values.fallHeight}
                  handleChange={setFieldValue}
                  errors={errors}
                  type='number'
                />
              )}
              <Grid container spacing={16}>
                <Grid item xs={12} sm={2}>
                  <Switch
                    name='responsive'
                    value={values.responsive}
                    label='Paciente está responsivo?'
                    handleChange={setFieldValue}
                  />
                </Grid>
                <Grid item xs={12} sm={10}>
                  <Select
                    label='Pulso (se presente)'
                    name='pulse'
                    value={values.pulse}
                    handleChange={setFieldValue}
                    options={[
                      { value: PULSE.REGULAR, label: 'Regular' },
                      { value: PULSE.FULL, label: 'Cheio' },
                      { value: PULSE.IRREGULAR, label: 'Irregular' },
                      { value: PULSE.THIN, label: 'Fino' },
                      { value: PULSE.MISSING_PCR, label: 'Ausente PCR' },
                    ]}
                  />
                </Grid>
              </Grid>
              <SectionTitle text='Tipo de acidente de trânsito' />
              <Checkbox
                name='accidentType'
                label='Atropelamento'
                checked={values.accidentType.includes(ACCIDENT_TYPE.TRAMPLING)}
                value={ACCIDENT_TYPE.TRAMPLING}
                handleChange={insertOrRemoveFromArray(values.accidentType, setFieldValue)}
                extraData={values.accidentType}
              />
              <Checkbox
                name='accidentType'
                label='Frontal'
                checked={values.accidentType.includes(ACCIDENT_TYPE.FRONT)}
                value={ACCIDENT_TYPE.FRONT}
                handleChange={insertOrRemoveFromArray(values.accidentType, setFieldValue)}
                extraData={values.accidentType}
              />
              <Checkbox
                name='accidentType'
                label='Lateral'
                checked={values.accidentType.includes(ACCIDENT_TYPE.SIDE)}
                value={ACCIDENT_TYPE.SIDE}
                handleChange={insertOrRemoveFromArray(values.accidentType, setFieldValue)}
                extraData={values.accidentType}
              />
              <Checkbox
                name='accidentType'
                label='Traseiro'
                checked={values.accidentType.includes(ACCIDENT_TYPE.REAR)}
                value={ACCIDENT_TYPE.REAR}
                handleChange={insertOrRemoveFromArray(values.accidentType, setFieldValue)}
                extraData={values.accidentType}
              />
              <Checkbox
                name='accidentType'
                label='Capotamento'
                checked={values.accidentType.includes(ACCIDENT_TYPE.ROLLOVER)}
                value={ACCIDENT_TYPE.ROLLOVER}
                handleChange={insertOrRemoveFromArray(values.accidentType, setFieldValue)}
                extraData={values.accidentType}
              />
              <Checkbox
                name='accidentType'
                label='Rotacional'
                checked={values.accidentType.includes(ACCIDENT_TYPE.ROTATIONAL)}
                value={ACCIDENT_TYPE.ROTATIONAL}
                handleChange={insertOrRemoveFromArray(values.accidentType, setFieldValue)}
                extraData={values.accidentType}
              />
              <SectionTitle text='Posição da vítima no veículo' />
              <Checkbox
                name='victimPostionInVehicle'
                label='Sem informação'
                checked={
                  values.victimPostionInVehicle === VICTIM_POSITION_IN_VEHICLE.NO_INFORMATION
                }
                value={VICTIM_POSITION_IN_VEHICLE.NO_INFORMATION}
                handleChange={checkOrUncheck(values.victimPostionInVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimPostionInVehicle'
                label='Condutor do veículo'
                checked={
                  values.victimPostionInVehicle === VICTIM_POSITION_IN_VEHICLE.VEHICLE_DRIVER
                }
                value={VICTIM_POSITION_IN_VEHICLE.VEHICLE_DRIVER}
                handleChange={checkOrUncheck(values.victimPostionInVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimPostionInVehicle'
                label='Acompanhante dianteiro'
                checked={
                  values.victimPostionInVehicle === VICTIM_POSITION_IN_VEHICLE.FRONT_PASSENGER
                }
                value={VICTIM_POSITION_IN_VEHICLE.FRONT_PASSENGER}
                handleChange={checkOrUncheck(values.victimPostionInVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimPostionInVehicle'
                label='Condutor ou garupa de moto'
                checked={
                  values.victimPostionInVehicle ===
                  VICTIM_POSITION_IN_VEHICLE.DRIVER_OR_MOTORCYCLE_RUMP
                }
                value={VICTIM_POSITION_IN_VEHICLE.DRIVER_OR_MOTORCYCLE_RUMP}
                handleChange={checkOrUncheck(values.victimPostionInVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimPostionInVehicle'
                label='Acompanhante traseiro'
                checked={
                  values.victimPostionInVehicle === VICTIM_POSITION_IN_VEHICLE.REAR_PASSENGER
                }
                value={VICTIM_POSITION_IN_VEHICLE.REAR_PASSENGER}
                handleChange={checkOrUncheck(values.victimPostionInVehicle, setFieldValue)}
              />
              <SectionTitle text='Equipamento de segurança' />
              <Checkbox
                name='safetyEquipment'
                label='Não usava'
                checked={values.safetyEquipment === SAFETY_EQUIPMENT.NONE}
                value={SAFETY_EQUIPMENT.NONE}
                handleChange={checkOrUncheck(values.safetyEquipment, setFieldValue)}
              />
              <Checkbox
                name='safetyEquipment'
                label='Sem informação'
                checked={values.safetyEquipment === SAFETY_EQUIPMENT.NO_INFORMATION}
                value={SAFETY_EQUIPMENT.NO_INFORMATION}
                handleChange={checkOrUncheck(values.safetyEquipment, setFieldValue)}
              />
              <Checkbox
                name='safetyEquipment'
                label='Cinto de 2 ou 3 pontos'
                checked={values.safetyEquipment === SAFETY_EQUIPMENT.TWO_OR_THREE_POINT_BELT}
                value={SAFETY_EQUIPMENT.TWO_OR_THREE_POINT_BELT}
                handleChange={checkOrUncheck(values.safetyEquipment, setFieldValue)}
              />
              <Checkbox
                name='safetyEquipment'
                label='Capacete retirado pela equipe'
                checked={values.safetyEquipment === SAFETY_EQUIPMENT.HELMET_TAKEN_BY_TEAM}
                value={SAFETY_EQUIPMENT.HELMET_TAKEN_BY_TEAM}
                handleChange={checkOrUncheck(values.safetyEquipment, setFieldValue)}
              />
              <Checkbox
                name='safetyEquipment'
                label='Capacete retirado por outros'
                checked={values.safetyEquipment === SAFETY_EQUIPMENT.HELMET_TAKEN_BY_OTHERS}
                value={SAFETY_EQUIPMENT.HELMET_TAKEN_BY_OTHERS}
                handleChange={checkOrUncheck(values.safetyEquipment, setFieldValue)}
              />
              <SectionTitle text='Localização da vítima' />
              <Checkbox
                name='victimLocation'
                label='Capacete retirado por outros'
                checked={values.victimLocation === VICTIM_LOCATION.WITHOUT_WRECKAGE}
                value={VICTIM_LOCATION.WITHOUT_WRECKAGE}
                handleChange={checkOrUncheck(values.victimLocation, setFieldValue)}
              />
              <Checkbox
                name='victimLocation'
                label='Às ferragens'
                checked={values.victimLocation === VICTIM_LOCATION.TRAPPED_IN_THE_WRECKAGE}
                value={VICTIM_LOCATION.TRAPPED_IN_THE_WRECKAGE}
                handleChange={checkOrUncheck(values.victimLocation, setFieldValue)}
              />
              <Checkbox
                name='victimLocation'
                label='Fora do veículo'
                checked={values.victimLocation === VICTIM_LOCATION.OUT_OF_VEHICLE}
                value={VICTIM_LOCATION.OUT_OF_VEHICLE}
                handleChange={checkOrUncheck(values.victimLocation, setFieldValue)}
              />
              <br />
              <Switch
                name='wandering'
                value={values.wandering}
                label='Deambulando?'
                handleChange={setFieldValue}
              />
              <SectionTitle text='Veículo da vítima' />
              <Checkbox
                name='victimVehicle'
                label='Carro'
                checked={values.victimVehicle === VICTIM_VEHICLE.CAR}
                value={VICTIM_VEHICLE.CAR}
                handleChange={checkOrUncheck(values.victimVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimVehicle'
                label='Moto'
                checked={values.victimVehicle === VICTIM_VEHICLE.MOTORCYCLE}
                value={VICTIM_VEHICLE.MOTORCYCLE}
                handleChange={checkOrUncheck(values.victimVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimVehicle'
                label='Caminhão'
                checked={values.victimVehicle === VICTIM_VEHICLE.TRUCK}
                value={VICTIM_VEHICLE.TRUCK}
                handleChange={checkOrUncheck(values.victimVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimVehicle'
                label='Ônibus'
                checked={values.victimVehicle === VICTIM_VEHICLE.BUS}
                value={VICTIM_VEHICLE.BUS}
                handleChange={checkOrUncheck(values.victimVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimVehicle'
                label='Van'
                checked={values.victimVehicle === VICTIM_VEHICLE.VAN}
                value={VICTIM_VEHICLE.VAN}
                handleChange={checkOrUncheck(values.victimVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimVehicle'
                label='Bicicleta'
                checked={values.victimVehicle === VICTIM_VEHICLE.BIKE}
                value={VICTIM_VEHICLE.BIKE}
                handleChange={checkOrUncheck(values.victimVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimVehicle'
                label='Sem informação'
                checked={values.victimVehicle === VICTIM_VEHICLE.NO_INFORMATION}
                value={VICTIM_VEHICLE.NO_INFORMATION}
                handleChange={checkOrUncheck(values.victimVehicle, setFieldValue)}
              />
              <Checkbox
                name='victimVehicle'
                label='Outro'
                checked={values.victimVehicle === VICTIM_VEHICLE.OTHER}
                value={VICTIM_VEHICLE.OTHER}
                handleChange={checkOrUncheck(values.victimVehicle, setFieldValue)}
              />
              {values.victimVehicle === VICTIM_VEHICLE.OTHER && (
                <TextInput
                  name='victimVehicleText'
                  label='Qual?'
                  value={values.victimVehicleText}
                  handleChange={setFieldValue}
                  errors={errors}
                />
              )}
              <SectionTitle text='Outro envolvido' />
              <Checkbox
                name='otherInvolved'
                label='Carro'
                checked={values.otherInvolved === VICTIM_VEHICLE.CAR}
                value={VICTIM_VEHICLE.CAR}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <Checkbox
                name='otherInvolved'
                label='Moto'
                checked={values.otherInvolved === VICTIM_VEHICLE.MOTORCYCLE}
                value={VICTIM_VEHICLE.MOTORCYCLE}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <Checkbox
                name='otherInvolved'
                label='Caminhão'
                checked={values.otherInvolved === VICTIM_VEHICLE.TRUCK}
                value={VICTIM_VEHICLE.TRUCK}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <Checkbox
                name='otherInvolved'
                label='Ônibus'
                checked={values.otherInvolved === VICTIM_VEHICLE.BUS}
                value={VICTIM_VEHICLE.BUS}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <Checkbox
                name='otherInvolved'
                label='Van'
                checked={values.otherInvolved === VICTIM_VEHICLE.VAN}
                value={VICTIM_VEHICLE.VAN}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <Checkbox
                name='otherInvolved'
                label='Bicicleta'
                checked={values.otherInvolved === VICTIM_VEHICLE.BIKE}
                value={VICTIM_VEHICLE.BIKE}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <Checkbox
                name='otherInvolved'
                label='Pedestre'
                checked={values.otherInvolved === VICTIM_VEHICLE.PEDESTRIAN}
                value={VICTIM_VEHICLE.PEDESTRIAN}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <Checkbox
                name='otherInvolved'
                label='Muro/Poste/Árvore'
                checked={values.otherInvolved === VICTIM_VEHICLE.WALL_LAMPOST_TREE}
                value={VICTIM_VEHICLE.WALL_LAMPOST_TREE}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <Checkbox
                name='otherInvolved'
                label='Sem informação'
                checked={values.otherInvolved === VICTIM_VEHICLE.NO_INFORMATION}
                value={VICTIM_VEHICLE.NO_INFORMATION}
                handleChange={checkOrUncheck(values.otherInvolved, setFieldValue)}
              />
              <SectionTitle text='Vias aéreas' />
              <Checkbox
                name='airways'
                label='Livre'
                checked={values.airways === AIRWAYS.FREE}
                value={AIRWAYS.FREE}
                handleChange={checkOrUncheck(values.airways, setFieldValue)}
              />
              <Checkbox
                name='airways'
                label='Obstrução total'
                checked={values.airways === AIRWAYS.TOTAL_OBSTRUCTION}
                value={AIRWAYS.TOTAL_OBSTRUCTION}
                handleChange={checkOrUncheck(values.airways, setFieldValue)}
              />
              <Checkbox
                name='airways'
                label='Edema de glote'
                checked={values.airways === AIRWAYS.GLOTTIS_EDEMA}
                value={AIRWAYS.GLOTTIS_EDEMA}
                handleChange={checkOrUncheck(values.airways, setFieldValue)}
              />
              <Checkbox
                name='airways'
                label='Corpo estranho'
                checked={values.airways === AIRWAYS.STRANGE_BODY}
                value={AIRWAYS.STRANGE_BODY}
                handleChange={checkOrUncheck(values.airways, setFieldValue)}
              />
              <Checkbox
                name='airways'
                label='Obstrução parcial'
                checked={values.airways === AIRWAYS.PARTIAL_OBSTRUCTION}
                value={AIRWAYS.PARTIAL_OBSTRUCTION}
                handleChange={checkOrUncheck(values.airways, setFieldValue)}
              />
              <Checkbox
                name='airways'
                label='Secreção'
                checked={values.airways === AIRWAYS.SECRETION}
                value={AIRWAYS.SECRETION}
                handleChange={checkOrUncheck(values.airways, setFieldValue)}
              />
              {values.airways === AIRWAYS.SECRETION && (
                <TextInput
                  name='secretionText'
                  label='Que tipo de secreção?'
                  value={values.secretionText}
                  handleChange={setFieldValue}
                  errors={errors}
                />
              )}
              <SectionTitle text='Respiração' />
              <Checkbox
                name='breath'
                label='Espontânea'
                checked={values.breath.includes(BREATH.SPONTANEOUS)}
                value={BREATH.SPONTANEOUS}
                handleChange={insertOrRemoveFromArray(values.breath, setFieldValue)}
                extraData={values.breath}
              />
              <Checkbox
                name='breath'
                label='Eupnéico'
                checked={values.breath.includes(BREATH.EUPHONIC)}
                value={BREATH.EUPHONIC}
                handleChange={insertOrRemoveFromArray(values.breath, setFieldValue)}
                extraData={values.breath}
              />
              <Checkbox
                name='breath'
                label='Apnéia'
                checked={values.breath.includes(BREATH.APNEA)}
                value={BREATH.APNEA}
                handleChange={insertOrRemoveFromArray(values.breath, setFieldValue)}
                extraData={values.breath}
              />
              <Checkbox
                name='breath'
                label='Dispnéia'
                checked={values.breath.includes(BREATH.DYSPNEA)}
                value={BREATH.DYSPNEA}
                handleChange={insertOrRemoveFromArray(values.breath, setFieldValue)}
                extraData={values.breath}
              />
              <Checkbox
                name='breath'
                label='IOT'
                checked={values.breath.includes(BREATH.IOT)}
                value={BREATH.IOT}
                handleChange={insertOrRemoveFromArray(values.breath, setFieldValue)}
                extraData={values.breath}
              />
              <Checkbox
                name='breath'
                label='Bradipnéia'
                checked={values.breath.includes(BREATH.BRANDIPNEA)}
                value={BREATH.BRANDIPNEA}
                handleChange={insertOrRemoveFromArray(values.breath, setFieldValue)}
                extraData={values.breath}
              />
              <Checkbox
                name='breath'
                label='Taquipnéia'
                checked={values.breath.includes(BREATH.TACHYPNEA)}
                value={BREATH.TACHYPNEA}
                handleChange={insertOrRemoveFromArray(values.breath, setFieldValue)}
                extraData={values.breath}
              />
              <Checkbox
                name='breath'
                label='Gasping'
                checked={values.breath.includes(BREATH.GASPING)}
                value={BREATH.GASPING}
                handleChange={insertOrRemoveFromArray(values.breath, setFieldValue)}
                extraData={values.breath}
              />
              <SectionTitle text='Ausculta pulmonar' />
              <Checkbox
                name='pulmonaryAuscultation'
                label='Normal'
                checked={values.pulmonaryAuscultation.includes(PULMONARY_AUSCULTATION.NORMAL)}
                value={PULMONARY_AUSCULTATION.NORMAL}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.pulmonaryAuscultation.filter(
                      x => x !== PULMONARY_AUSCULTATION.NOT_PERFORMED,
                    ),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.pulmonaryAuscultation}
              />
              <Checkbox
                name='pulmonaryAuscultation'
                label='Roncos/Sibilos DE'
                checked={values.pulmonaryAuscultation.includes(
                  PULMONARY_AUSCULTATION.SNORING_WHEEZING_DE,
                )}
                value={PULMONARY_AUSCULTATION.SNORING_WHEEZING_DE}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.pulmonaryAuscultation.filter(
                      x => x !== PULMONARY_AUSCULTATION.NOT_PERFORMED,
                    ),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.pulmonaryAuscultation}
              />
              <Checkbox
                name='pulmonaryAuscultation'
                label='MV Diminuídos D/E'
                checked={values.pulmonaryAuscultation.includes(
                  PULMONARY_AUSCULTATION.MV_DECREASED_DE,
                )}
                value={PULMONARY_AUSCULTATION.MV_DECREASED_DE}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.pulmonaryAuscultation.filter(
                      x => x !== PULMONARY_AUSCULTATION.NOT_PERFORMED,
                    ),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.pulmonaryAuscultation}
              />
              <Checkbox
                name='pulmonaryAuscultation'
                label='MV ausente D/E'
                checked={values.pulmonaryAuscultation.includes(PULMONARY_AUSCULTATION.MV_ABSENT_DE)}
                value={PULMONARY_AUSCULTATION.MV_ABSENT_DE}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.pulmonaryAuscultation.filter(
                      x => x !== PULMONARY_AUSCULTATION.NOT_PERFORMED,
                    ),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.pulmonaryAuscultation}
              />
              <Checkbox
                name='pulmonaryAuscultation'
                label='Estertores D/E'
                checked={values.pulmonaryAuscultation.includes(PULMONARY_AUSCULTATION.RALES_DE)}
                value={PULMONARY_AUSCULTATION.RALES_DE}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.pulmonaryAuscultation.filter(
                      x => x !== PULMONARY_AUSCULTATION.NOT_PERFORMED,
                    ),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.pulmonaryAuscultation}
              />
              <Checkbox
                name='pulmonaryAuscultation'
                label='Não realizado'
                checked={values.pulmonaryAuscultation.includes(
                  PULMONARY_AUSCULTATION.NOT_PERFORMED,
                )}
                value={PULMONARY_AUSCULTATION.NOT_PERFORMED}
                handleChange={(name, value) => {
                  if (values.pulmonaryAuscultation.includes(value)) {
                    setFieldValue(
                      'pulmonaryAuscultation',
                      values.pulmonaryAuscultation.filter(
                        x => x !== PULMONARY_AUSCULTATION.NOT_PERFORMED,
                      ),
                    )
                  } else {
                    setFieldValue('pulmonaryAuscultation', [PULMONARY_AUSCULTATION.NOT_PERFORMED])
                  }
                }}
                extraData={values.pulmonaryAuscultation}
              />
              <SectionTitle text='Achados' />
              <Checkbox
                name='findings'
                label='Hálito Etílico'
                checked={values.findings.includes(FINDINGS.ETHYL_BREATH)}
                value={FINDINGS.ETHYL_BREATH}
                handleChange={insertOrRemoveFromArray(values.findings, setFieldValue)}
                extraData={values.findings}
              />
              <Checkbox
                name='findings'
                label='Hemoptise'
                checked={values.findings.includes(FINDINGS.HEMOPTYSIS)}
                value={FINDINGS.HEMOPTYSIS}
                handleChange={insertOrRemoveFromArray(values.findings, setFieldValue)}
                extraData={values.findings}
              />
              <Checkbox
                name='findings'
                label='Enfisema Subcutâneo'
                checked={values.findings.includes(FINDINGS.SUBCUTANEOUS_EMPHYSEMA)}
                value={FINDINGS.SUBCUTANEOUS_EMPHYSEMA}
                handleChange={insertOrRemoveFromArray(values.findings, setFieldValue)}
                extraData={values.findings}
              />
              <Checkbox
                name='findings'
                label='Crepitação'
                checked={values.findings.includes(FINDINGS.CRACKLING)}
                value={FINDINGS.CRACKLING}
                handleChange={insertOrRemoveFromArray(values.findings, setFieldValue)}
                extraData={values.findings}
              />
              <Checkbox
                name='findings'
                label='Sangramento'
                checked={values.findings.includes(FINDINGS.BLEEDING)}
                value={FINDINGS.BLEEDING}
                handleChange={insertOrRemoveFromArray(values.findings, setFieldValue)}
                extraData={values.findings}
              />
              <Checkbox
                name='findings'
                label='Outro'
                checked={values.findings.includes(FINDINGS.OTHER)}
                value={FINDINGS.OTHER}
                handleChange={insertOrRemoveFromArray(values.findings, setFieldValue)}
                extraData={values.findings}
              />
              {values.findings.includes(FINDINGS.OTHER) && (
                <TextInput
                  name='findingsText'
                  label='Quais?'
                  value={values.findingsText}
                  handleChange={setFieldValue}
                  errors={errors}
                />
              )}
              <SectionTitle text='Pele' />
              <Checkbox
                name='skin'
                label='Corada'
                checked={values.skin.includes(SKIN.STAINED)}
                value={SKIN.STAINED}
                handleChange={insertOrRemoveFromArray(values.skin, setFieldValue)}
                extraData={values.skin}
              />
              <Checkbox
                name='skin'
                label='Descorada'
                checked={values.skin.includes(SKIN.PALE)}
                value={SKIN.PALE}
                handleChange={insertOrRemoveFromArray(values.skin, setFieldValue)}
                extraData={values.skin}
              />
              <Checkbox
                name='skin'
                label='Quente'
                checked={values.skin.includes(SKIN.HOT)}
                value={SKIN.HOT}
                handleChange={insertOrRemoveFromArray(values.skin, setFieldValue)}
                extraData={values.skin}
              />
              <Checkbox
                name='skin'
                label='Fria'
                checked={values.skin.includes(SKIN.COLD)}
                value={SKIN.COLD}
                handleChange={insertOrRemoveFromArray(values.skin, setFieldValue)}
                extraData={values.skin}
              />
              <Checkbox
                name='skin'
                label='Ictérica'
                checked={values.skin.includes(SKIN.ICTERIC)}
                value={SKIN.ICTERIC}
                handleChange={insertOrRemoveFromArray(values.skin, setFieldValue)}
                extraData={values.skin}
              />
              <Checkbox
                name='skin'
                label='Cianótica'
                checked={values.skin.includes(SKIN.CYANOTIC)}
                value={SKIN.CYANOTIC}
                handleChange={insertOrRemoveFromArray(values.skin, setFieldValue)}
                extraData={values.skin}
              />
              <Checkbox
                name='skin'
                label='Úmida'
                checked={values.skin.includes(SKIN.DAMP)}
                value={SKIN.DAMP}
                handleChange={insertOrRemoveFromArray(values.skin, setFieldValue)}
                extraData={values.skin}
              />
              <Checkbox
                name='skin'
                label='Seca'
                checked={values.skin.includes(SKIN.DRY)}
                value={SKIN.DRY}
                handleChange={insertOrRemoveFromArray(values.skin, setFieldValue)}
                extraData={values.skin}
              />
              <SectionTitle text='Perfusão' />
              <Checkbox
                name='infusion'
                label='Normal'
                checked={values.infusion === INFUSION.NORMAL}
                value={INFUSION.NORMAL}
                handleChange={checkOrUncheck(values.infusion, setFieldValue)}
              />
              <Checkbox
                name='infusion'
                label='Retardada'
                checked={values.infusion === INFUSION.RETARDED}
                value={INFUSION.RETARDED}
                handleChange={checkOrUncheck(values.infusion, setFieldValue)}
              />
              <Checkbox
                name='infusion'
                label='Cianótica'
                checked={values.infusion === INFUSION.CYANOTIC}
                value={INFUSION.CYANOTIC}
                handleChange={checkOrUncheck(values.infusion, setFieldValue)}
              />
              <SectionTitle text='Ausculta Cardíaca' />
              <Checkbox
                name='heartAuscultation'
                label='Normal'
                checked={values.heartAuscultation.includes(HEART_AUSCULTATION.NORMAL)}
                value={HEART_AUSCULTATION.NORMAL}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.heartAuscultation.filter(x => x !== HEART_AUSCULTATION.UNREALIZED),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.heartAuscultation}
              />
              <Checkbox
                name='heartAuscultation'
                label='Hipofonese'
                checked={values.heartAuscultation.includes(HEART_AUSCULTATION.HYPOPHONESE)}
                value={HEART_AUSCULTATION.HYPOPHONESE}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.heartAuscultation.filter(x => x !== HEART_AUSCULTATION.UNREALIZED),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.heartAuscultation}
              />
              <Checkbox
                name='heartAuscultation'
                label='Arritmia'
                checked={values.heartAuscultation.includes(HEART_AUSCULTATION.ARRHYTHMIA)}
                value={HEART_AUSCULTATION.ARRHYTHMIA}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.heartAuscultation.filter(x => x !== HEART_AUSCULTATION.UNREALIZED),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.heartAuscultation}
              />
              <Checkbox
                name='heartAuscultation'
                label='Sopro'
                checked={values.heartAuscultation.includes(HEART_AUSCULTATION.BLOW)}
                value={HEART_AUSCULTATION.BLOW}
                handleChange={(name, value) =>
                  insertOrRemoveFromArray(
                    values.heartAuscultation.filter(x => x !== HEART_AUSCULTATION.UNREALIZED),
                    setFieldValue,
                  )(name, value)
                }
                extraData={values.heartAuscultation}
              />
              <Checkbox
                name='heartAuscultation'
                label='Não realizado'
                checked={values.heartAuscultation.includes(HEART_AUSCULTATION.UNREALIZED)}
                value={HEART_AUSCULTATION.UNREALIZED}
                handleChange={(name, value) => {
                  if (values.heartAuscultation.includes(value)) {
                    setFieldValue(
                      'heartAuscultation',
                      values.heartAuscultation.filter(x => x !== HEART_AUSCULTATION.UNREALIZED),
                    )
                  } else {
                    setFieldValue('heartAuscultation', [HEART_AUSCULTATION.UNREALIZED])
                  }
                }}
                extraData={values.heartAuscultation}
              />
              <SectionTitle text='Exame Neurológico' />
              <Checkbox
                name='neurologicalExamination'
                label='Normal'
                checked={values.neurologicalExamination.includes(NEUROLOGICAL_EXAMINATION.NORMAL)}
                value={NEUROLOGICAL_EXAMINATION.NORMAL}
                handleChange={insertOrRemoveFromArray(
                  values.neurologicalExamination,
                  setFieldValue,
                )}
                extraData={values.neurologicalExamination}
              />
              <Checkbox
                name='neurologicalExamination'
                label='Agitação'
                checked={values.neurologicalExamination.includes(NEUROLOGICAL_EXAMINATION.SHAKING)}
                value={NEUROLOGICAL_EXAMINATION.SHAKING}
                handleChange={insertOrRemoveFromArray(
                  values.neurologicalExamination,
                  setFieldValue,
                )}
                extraData={values.neurologicalExamination}
              />
              <Checkbox
                name='neurologicalExamination'
                label='Convulsão'
                checked={values.neurologicalExamination.includes(
                  NEUROLOGICAL_EXAMINATION.CONVULSION,
                )}
                value={NEUROLOGICAL_EXAMINATION.CONVULSION}
                handleChange={insertOrRemoveFromArray(
                  values.neurologicalExamination,
                  setFieldValue,
                )}
                extraData={values.neurologicalExamination}
              />
              <Checkbox
                name='neurologicalExamination'
                label='Sonolência'
                checked={values.neurologicalExamination.includes(
                  NEUROLOGICAL_EXAMINATION.SOMNOLENCE,
                )}
                value={NEUROLOGICAL_EXAMINATION.SOMNOLENCE}
                handleChange={insertOrRemoveFromArray(
                  values.neurologicalExamination,
                  setFieldValue,
                )}
                extraData={values.neurologicalExamination}
              />
              <Checkbox
                name='neurologicalExamination'
                label='Obnubilação'
                checked={values.neurologicalExamination.includes(
                  NEUROLOGICAL_EXAMINATION.OBNUBILATION,
                )}
                value={NEUROLOGICAL_EXAMINATION.OBNUBILATION}
                handleChange={insertOrRemoveFromArray(
                  values.neurologicalExamination,
                  setFieldValue,
                )}
                extraData={values.neurologicalExamination}
              />
              <Switch
                name='aphasia'
                value={values.aphasia}
                label='Afasia?'
                handleChange={setFieldValue}
              />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={2}>
                  <SectionTitle text='Otorragia' />
                  <Checkbox
                    name='otorrhagia'
                    label='D'
                    checked={values.otorrhagia.includes('D')}
                    value={'D'}
                    handleChange={insertOrRemoveFromArray(values.otorrhagia, setFieldValue)}
                    extraData={values.otorrhagia}
                  />
                  <Checkbox
                    name='otorrhagia'
                    label='E'
                    checked={values.otorrhagia.includes('E')}
                    value={'E'}
                    handleChange={insertOrRemoveFromArray(values.otorrhagia, setFieldValue)}
                    extraData={values.otorrhagia}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <SectionTitle text='Olhos de guaxinim' />
                  <Checkbox
                    name='racoonEyes'
                    label='D'
                    checked={values.racoonEyes.includes('D')}
                    value={'D'}
                    handleChange={insertOrRemoveFromArray(values.racoonEyes, setFieldValue)}
                    extraData={values.racoonEyes}
                  />
                  <Checkbox
                    name='racoonEyes'
                    label='E'
                    checked={values.racoonEyes.includes('E')}
                    value={'E'}
                    handleChange={insertOrRemoveFromArray(values.racoonEyes, setFieldValue)}
                    extraData={values.racoonEyes}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <SectionTitle text='Battle' />
                  <Checkbox
                    name='battle'
                    label='D'
                    checked={values.battle.includes('D')}
                    value={'D'}
                    handleChange={insertOrRemoveFromArray(values.battle, setFieldValue)}
                    extraData={values.battle}
                  />
                  <Checkbox
                    name='battle'
                    label='E'
                    checked={values.battle.includes('E')}
                    value={'E'}
                    handleChange={insertOrRemoveFromArray(values.battle, setFieldValue)}
                    extraData={values.battle}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <SectionTitle text='Déficit Motor' />
                  <Checkbox
                    name='motorDeficit'
                    label={'MSD'}
                    checked={values.motorDeficit.includes(MOTOR_DEFICIT.MSD)}
                    value={MOTOR_DEFICIT.MSD}
                    handleChange={insertOrRemoveFromArray(values.motorDeficit, setFieldValue)}
                    extraData={values.motorDeficit}
                  />
                  <Checkbox
                    name='motorDeficit'
                    label={'MID'}
                    checked={values.motorDeficit.includes(MOTOR_DEFICIT.MID)}
                    value={MOTOR_DEFICIT.MID}
                    handleChange={insertOrRemoveFromArray(values.motorDeficit, setFieldValue)}
                    extraData={values.motorDeficit}
                  />
                  <Checkbox
                    name='motorDeficit'
                    label={'MSE'}
                    checked={values.motorDeficit.includes(MOTOR_DEFICIT.MSE)}
                    value={MOTOR_DEFICIT.MSE}
                    handleChange={insertOrRemoveFromArray(values.motorDeficit, setFieldValue)}
                    extraData={values.motorDeficit}
                  />
                  <Checkbox
                    name='motorDeficit'
                    label={'MIE'}
                    checked={values.motorDeficit.includes(MOTOR_DEFICIT.MIE)}
                    value={MOTOR_DEFICIT.MIE}
                    handleChange={insertOrRemoveFromArray(values.motorDeficit, setFieldValue)}
                    extraData={values.motorDeficit}
                  />
                </Grid>
                <Switch
                  name='stiffNeck'
                  value={values.stiffNeck}
                  label='Rigidez de nuca?'
                  handleChange={setFieldValue}
                />
              </Grid>
              <SectionTitle text='Pupilas' />
              <Checkbox
                name='pupils'
                label='Isocóricas'
                checked={values.pupils.includes(PUPILS.ISOCHORIC)}
                value={PUPILS.ISOCHORIC}
                handleChange={insertOrRemoveFromArray(values.pupils, setFieldValue)}
                extraData={values.pupils}
              />
              <Checkbox
                name='pupils'
                label='Anisocóricas'
                checked={values.pupils.includes(PUPILS.ANISOCORTICAL)}
                value={PUPILS.ANISOCORTICAL}
                handleChange={insertOrRemoveFromArray(values.pupils, setFieldValue)}
                extraData={values.pupils}
              />
              <Checkbox
                name='pupils'
                label='Mioticas'
                checked={values.pupils.includes(PUPILS.MYOTIC)}
                value={PUPILS.MYOTIC}
                handleChange={insertOrRemoveFromArray(values.pupils, setFieldValue)}
                extraData={values.pupils}
              />
              <Checkbox
                name='pupils'
                label='Midriáticas'
                checked={values.pupils.includes(PUPILS.MYTRIATIC)}
                value={PUPILS.MYTRIATIC}
                handleChange={insertOrRemoveFromArray(values.pupils, setFieldValue)}
                extraData={values.pupils}
              />
              <Checkbox
                name='pupils'
                label='Reagente'
                checked={values.pupils.includes(PUPILS.REACTIVE)}
                value={PUPILS.REACTIVE}
                handleChange={insertOrRemoveFromArray(values.pupils, setFieldValue)}
                extraData={values.pupils}
              />
              <Checkbox
                name='pupils'
                label='Não reagente'
                checked={values.pupils.includes(PUPILS.NON_REACTIVE)}
                value={PUPILS.NON_REACTIVE}
                handleChange={insertOrRemoveFromArray(values.pupils, setFieldValue)}
                extraData={values.pupils}
              />
              <SectionTitle text='Gineco/Obstetrícia' />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={1}>
                  <TextInput
                    name='obstetricsG'
                    label='G'
                    value={values.obstetricsG}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextInput
                    name='obstetricsP'
                    label='P'
                    value={values.obstetricsP}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextInput
                    name='obstetricsA'
                    label='A'
                    value={values.obstetricsA}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextInput
                    name='obstetricsIG'
                    label='IG'
                    value={values.obstetricsIG}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Switch
                    name='labour'
                    value={values.labour}
                    label='Trabalho de parto?'
                    handleChange={setFieldValue}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Switch
                    name='contractions'
                    value={values.contractions}
                    label='Contrações'
                    handleChange={setFieldValue}
                  />
                </Grid>
                {values.contractions && (
                  <Grid item xs={12} sm={2}>
                    <Select
                      label='Contração'
                      name='contractionType'
                      value={values.contractionType}
                      handleChange={setFieldValue}
                      options={[
                        { label: 'Fraca', value: CONTRACTION_TYPE.WEAK },
                        { label: 'Moderada', value: CONTRACTION_TYPE.MODERATE },
                        { label: 'Forte', value: CONTRACTION_TYPE.STRONG },
                      ]}
                    />
                  </Grid>
                )}
                <Grid item xs={6} sm={1}>
                  <TextInput
                    name='contractionNumber'
                    label='N°'
                    value={values.contractionNumber}
                    handleChange={setFieldValue}
                    errors={errors}
                    type='number'
                  />
                </Grid>
                <Grid item xs={6} sm={1}>
                  <TextInput
                    name='contractionMin'
                    label='Min'
                    value={values.contractionMin}
                    handleChange={setFieldValue}
                    errors={errors}
                    type='number'
                  />
                </Grid>
                <Grid item xs={6} sm={1}>
                  <Switch
                    name='amnioticSacBroke'
                    value={values.amnioticSacBroke}
                    label='Bolsa rota'
                    handleChange={setFieldValue}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextInput
                    name='touchCm'
                    label='Toque (cm/dilatação)'
                    value={values.touchCm}
                    handleChange={setFieldValue}
                    errors={errors}
                    type='number'
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <Switch
                    name='abortion'
                    value={values.abortion}
                    label='Abortamento'
                    handleChange={setFieldValue}
                  />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <Switch
                    name='vaginalBleeding'
                    value={values.vaginalBleeding}
                    label='Hemorragia Vaginal'
                    handleChange={setFieldValue}
                  />
                </Grid>
              </Grid>
              <SectionTitle text='RN' />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={1}>
                  <Checkbox
                    name='rn'
                    label={'Vivo'}
                    checked={values.rn.includes(RN.LIVE)}
                    value={RN.LIVE}
                    handleChange={insertOrRemoveFromArray(values.rn, setFieldValue)}
                    extraData={values.rn}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <Checkbox
                    name='rn'
                    label={'Morto'}
                    checked={values.rn.includes(RN.DEATH)}
                    value={RN.DEATH}
                    handleChange={insertOrRemoveFromArray(values.rn, setFieldValue)}
                    extraData={values.rn}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Checkbox
                    name='rn'
                    label={'Dequi Placenta'}
                    checked={values.rn.includes(RN.DEQUI_PLACENTA)}
                    value={RN.DEQUI_PLACENTA}
                    handleChange={insertOrRemoveFromArray(values.rn, setFieldValue)}
                    extraData={values.rn}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextInput
                    name='firstApgar'
                    label='1° Apgar'
                    value={values.firstApgar}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextInput
                    name='secondApgar'
                    label='2° Apgar'
                    value={values.secondApgar}
                    handleChange={setFieldValue}
                    errors={errors}
                  />
                </Grid>
              </Grid>
              <SectionTitle text='Achados do Exame físico' />
              <Grid container spacing={16}>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='physicalExaminationFindingsHead'
                    label='Cabeça'
                    value={values.physicalExaminationFindingsHead}
                    handleChange={setFieldValue}
                    errors={errors}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='physicalExaminationFindingsNeck'
                    label='Pescoço'
                    value={values.physicalExaminationFindingsNeck}
                    handleChange={setFieldValue}
                    errors={errors}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='physicalExaminationFindingsChest'
                    label='Tórax'
                    value={values.physicalExaminationFindingsChest}
                    handleChange={setFieldValue}
                    errors={errors}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='physicalExaminationFindingsAbdomen'
                    label='Abdome'
                    value={values.physicalExaminationFindingsAbdomen}
                    handleChange={setFieldValue}
                    errors={errors}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='physicalExaminationFindingsPelvis'
                    label='Pelve'
                    value={values.physicalExaminationFindingsPelvis}
                    handleChange={setFieldValue}
                    errors={errors}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name='physicalExaminationFindingsExtremities'
                    label='Extremidades'
                    value={values.physicalExaminationFindingsExtremities}
                    handleChange={setFieldValue}
                    errors={errors}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
              <SectionTitle text='Procedimentos Realizados' />
              <Checkbox
                name='performedProcedures'
                label='Guedel'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.GUEDEL)}
                value={PERFORMED_PROCEDURES.GUEDEL}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Aspiração'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.ASPIRATION)}
                value={PERFORMED_PROCEDURES.ASPIRATION}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='IOT'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.IOT)}
                value={PERFORMED_PROCEDURES.IOT}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='V.M'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.VM)}
                value={PERFORMED_PROCEDURES.VM}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Máscara O2'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.MASK_O2)}
                value={PERFORMED_PROCEDURES.MASK_O2}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Catéter O2'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.CATHETER_02)}
                value={PERFORMED_PROCEDURES.CATHETER_02}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Ventilação c/ Ambú'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.AMBU_VENTILATION)}
                value={PERFORMED_PROCEDURES.AMBU_VENTILATION}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Monitoriz. Cardíaca'
                checked={values.performedProcedures.includes(
                  PERFORMED_PROCEDURES.CARDIAC_MONITORING,
                )}
                value={PERFORMED_PROCEDURES.CARDIAC_MONITORING}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Desfibrilação'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.DEFIBRILLATION)}
                value={PERFORMED_PROCEDURES.DEFIBRILLATION}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Marcapasso'
                checked={values.performedProcedures.includes(
                  PERFORMED_PROCEDURES.CARDIPACEMAKERAC_MONITORING,
                )}
                value={PERFORMED_PROCEDURES.CARDIPACEMAKERAC_MONITORING}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Colar cervical'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.NECK_BRACE)}
                value={PERFORMED_PROCEDURES.NECK_BRACE}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Imobilização'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.IMMOBILIZATION)}
                value={PERFORMED_PROCEDURES.IMMOBILIZATION}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Oxímetro'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.OXIMETER)}
                value={PERFORMED_PROCEDURES.OXIMETER}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Cardioversão'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.CARDIOVERSION)}
                value={PERFORMED_PROCEDURES.CARDIOVERSION}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Curativo'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.BANDAID)}
                value={PERFORMED_PROCEDURES.BANDAID}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Prancha rígida'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.RIGID_BOARD)}
                value={PERFORMED_PROCEDURES.RIGID_BOARD}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Retirada rápida'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.QUICK_TAKE)}
                value={PERFORMED_PROCEDURES.QUICK_TAKE}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Aquecimento'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.HEATING)}
                value={PERFORMED_PROCEDURES.HEATING}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Acesso Venoso'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.VENOUS_ACCESS)}
                value={PERFORMED_PROCEDURES.VENOUS_ACCESS}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='KED'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.KED)}
                value={PERFORMED_PROCEDURES.KED}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <Checkbox
                name='performedProcedures'
                label='Controle de Hemorragia'
                checked={values.performedProcedures.includes(PERFORMED_PROCEDURES.BLEEDING_CONTROL)}
                value={PERFORMED_PROCEDURES.BLEEDING_CONTROL}
                handleChange={insertOrRemoveFromArray(values.performedProcedures, setFieldValue)}
                extraData={values.performedProcedures}
              />
              <br />
              <Grid container>
                <Grid item xs={12} sm={10}>
                  {Object.keys(errors).length > 0 && (
                    <Typography variant='caption' style={{ ...styles.error, textAlign: 'right' }}>
                      Alguns campos necessários não foram preenchidos, por favor verifique os dados.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    type='submit'
                    fullWidth
                    variant='outlined'
                    style={{ alignSelf: 'flex-end' }}
                    onClick={evt => handleSubmit()}
                    disabled={isSubmitting}
                    id='submit-medical-record-button'
                  >
                    {isSubmitting ? 'Enviando...' : 'Cadastrar'}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Formik>
      </Layout>
    )
  }
}
