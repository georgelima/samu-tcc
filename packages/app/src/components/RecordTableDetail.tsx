import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'
import dateFns from 'date-fns'

const Wrapper = styled.div`
  padding: 20px;
`

const Title = styled(Typography).attrs({
  variant: 'h6',
})`
  && {
    margin-bottom: 10px;
    margin-top: 10px;
  }
`

type Props = {
  record: { [x: string]: any }
}

const getRequestReason = (text: string) => {
  switch (text) {
    case 'CLINICAL':
      return 'Clínico'
    case 'SURGICAL':
      return 'Cirúrgico'
    case 'OBSTETRIC':
      return 'Obstétrico'
    case 'PSYCHIATRIC':
      return 'Psiquiátrico'
    case 'PEDIATRIC':
      return 'Pediátrico'
    case 'INTERHOSPITAL_TRANSPORT':
      return 'Transporte Interhospitalar'
    default:
      return 'Outro'
  }
}

const LOCATION = {
  STREET: 'Rua',
  PUBLIC_PLACE: 'Lugar Público',
  RESIDENCE: 'Residência',
  HIGHWAY: 'Rodovia',
  OTHER: 'Outro',
}

const LOCATION_SITUATION = {
  SAFE_SCENE: 'Cena segura',
  UNSAFE_SCENE: 'Cena insegura',
  HARD_ACCESS: 'Dificil Acesso',
  ANIMALS_RISK: 'Animais oferecem risco',
  UNIDENTIFIED_STREET: 'Rua sem identificação',
  FIRE: 'Incêndio',
  DANGEROUS_PRODUCT: 'Produto Perigoso',
  CROWDING: 'Aglomeração',
  THIRD_PARTIES_RISK: 'Terceiros oferecem risco',
  OIL_ON_THE_ROAD: 'Óleo na via',
}

const VICTIM_SITUATION = {
  EVASION: 'Evadiu',
  NOT_LOCALIZED: 'Não localizada',
  AGGRESSIVE: 'Agressiva',
  TRAPPED_IN_THE_WRECKAGE: 'Presa às ferragens',
  OTHER: 'Outro',
}

const COMPLICATIONS = {
  QTA_ON_LOCAL: 'QTA no Local',
  QTA_ON_THE_WAY: 'QTA no Caminho',
  FALSE_CALL: 'Trote',
  MULTIPLE_VICTIMS: 'Múltiplas Vítimas',
}

const SUPPORT_REQUEST = {
  NO: 'Não',
  USA: 'USA',
  USB: 'USB',
  190: '190',
  193: '193',
  OTHER: 'Outro',
}

const ALLERGY = {
  DENY: 'Nega',
  UNINFORMED: 'Não informado',
  CANT_INFORM: 'Sem condições de informar',
  YES: 'Sim',
}

const PERSONAL_BACKGROUND = {
  HAS: 'HAS',
  HEART_DISEASE: 'Cardiopata',
  PREVIOUS_IAM: 'IAM Anterior',
  PREVIOUS_AVE: 'AVE Anterior',
  CONVULSIONS: 'Convulsões',
  DIABETES: 'Diabetes',
  SURGICAL: 'Cirúrgico',
  ASTHMA_BRONCHITIS_DPOC: 'Asma/Bronquite/DPOC',
  DENY_PREVIOUS_TREATMENT: 'Nega tratamento anterior ou atual',
  CANT_INFORM: 'Sem condições de informar',
  OTHER: 'Outro',
}

const TRAUMA_MECHANISM = {
  NOT_APPLICABLE: 'Não se aplica',
  TRAFFIC_ACCIDENT: 'Acidente de Trânsito',
  FAB: 'FAB',
  FALL: 'FALL',
  INTERLOCKING: 'Encravamento',
  FPAF: 'FPAF',
  FALL_OWN_HEIGHT: 'Queda própria altura',
  BURN: 'Queimadura',
  AGGRESSION: 'Agressão',
}

const PULSE = {
  REGULAR: 'Regular',
  FULL: 'Cheio',
  IRREGULAR: 'Irregular',
  THIN: 'Fino',
  MISSING_PCR: 'Ausente PCR',
}

const ACCIDENT_TYPE = {
  TRAMPLING: 'Atropelamento',
  FRONT: 'Frontal',
  SIDE: 'Lateral',
  REAR: 'Traseiro',
  ROLLOVER: 'Capotamento',
  ROTATIONAL: 'Rotacional',
}

const VICTIM_POSITION_IN_VEHICLE = {
  NO_INFORMATION: 'Sem informação',
  FRONT_PASSENGER: 'Acompanhante dianteiro',
  DRIVER_OR_MOTORCYCLE_RUMP: 'Condutor ou garupa da moto',
  VEHICLE_DRIVER: 'Condutor do veículo',
  REAR_PASSENGER: 'Acompanhante traseiro',
}

const SAFETY_EQUIPMENT = {
  NONE: 'Nenhum',
  NO_INFORMATION: 'Sem informação',
  TWO_OR_THREE_POINT_BELT: 'Cinto de 2 ou 3 pontos',
  HELMET_TAKEN_BY_TEAM: 'Capacete retirado pela equipe',
  HELMET_TAKEN_BY_OTHERS: 'Capacete retirado por outros',
}

const VICTIM_LOCATION = {
  WITHOUT_WRECKAGE: 'Sem ferragens',
  TRAPPED_IN_THE_WRECKAGE: 'Às ferragens',
  OUT_OF_VEHICLE: 'Fora do veículo',
}

const VICTIM_VEHICLE = {
  CAR: 'Carro',
  MOTORCYCLE: 'Moto',
  TRUCK: 'Caminhão',
  BUS: 'Ônibus',
  VAN: 'Van',
  BIKE: 'Bicicleta',
  NO_INFORMATION: 'Sem informação',
  OTHER: 'Outro',
  PEDESTRIAN: 'Pedestre',
  WALL_LAMPOST_TREE: 'Muro/Poste/Árvore',
}

const AIRWAYS = {
  FREE: 'Livre',
  TOTAL_OBSTRUCTION: 'Obstrução total',
  GLOTTIS_EDEMA: 'Edema de glote',
  STRANGE_BODY: 'Corpo estranho',
  SECRETION: 'Secreção',
  PARTIAL_OBSTRUCTION: 'Obstrução parcial',
}

const BREATH = {
  SPONTANEOUS: 'Espontânea',
  EUPHONIC: 'Eupnéico',
  APNEA: 'Apnéia',
  DYSPNEA: 'Dispnéia',
  IOT: 'IOT',
  BRANDIPNEA: 'Bradipnéia',
  GASPING: 'Gasping',
  TACHYPNEA: 'Taquipnéia',
}

const PULMONARY_AUSCULTATION = {
  NORMAL: 'Normal',
  SNORING_WHEEZING_DE: 'Roncos/Sibilos DE',
  MV_DECREASED_DE: 'MV Diminuídos D/E',
  MV_ABSENT_DE: 'MV Ausente D/E',
  NOT_PERFORMED: 'Não realizado',
  RALES_DE: 'Estertores D/E',
}

const FINDINGS = {
  ETHYL_BREATH: 'Hálito Etílico',
  HEMOPTYSIS: 'Hemoptise',
  SUBCUTANEOUS_EMPHYSEMA: 'Enfisema Subcutâneo',
  CRACKLING: 'Crepitação',
  BLEEDING: 'Sangramento',
  OTHER: 'Outro',
}

const SKIN = {
  STAINED: 'Corada',
  PALE: 'Descorada',
  HOT: 'Quente',
  COLD: 'Fria',
  ICTERIC: 'Ictérica',
  CYANOTIC: 'Cianótica',
  DAMP: 'Úmida',
  DRY: 'Seca',
}

const INFUSION = {
  NORMAL: 'Normal',
  RETARDED: 'Retardada',
  CYANOTIC: 'Cianótica',
}

const HEART_AUSCULTATION = {
  NORMAL: 'Normal',
  BLOW: 'Sopro',
  HYPOPHONESE: 'Hipofonose',
  ARRHYTHMIA: 'Arritimia',
  UNREALIZED: 'Não realizado',
}

const NEUROLOGICAL_EXAMINATION = {
  NORMAL: 'Normal',
  SHAKING: 'Agitação',
  CONVULSION: 'Convulsão',
  SOMNOLENCE: 'Sonolência',
  OBNUBILATION: 'Obnubilação',
}

const MOTOR_DEFICIT = {
  MSD: 'MSD',
  MID: 'MID',
  MSE: 'MSE',
  MIE: 'MIE',
}

const PUPILS = {
  ISOCHORIC: 'Isocóricas',
  ANISOCORTICAL: 'Anisocóricas',
  MYOTIC: 'Mioticas',
  MYTRIATIC: 'Midriáticas',
  REACTIVE: 'Reagente',
  NON_REACTIVE: 'Não reagente',
}

const CONTRACTION_TYPE = {
  NO: 'Não',
  WEAK: 'Franca',
  STRONG: 'Forte',
  MODERATE: 'Moderada',
}

const RN = {
  LIVE: 'Vivo',
  DEATH: 'Morto',
  DEQUI_PLACENTA: 'Dequi Placenta',
}

const PERFORMED_PROCEDURES = {
  GUEDEL: 'Guedel',
  ASPIRATION: 'Aspiração',
  IOT: 'IOT',
  VM: 'V.M.',
  MASK_O2: 'Máscara O2',
  CATHETER_02: 'Catéter O2',
  AMBU_VENTILATION: 'Ventilação c/ Ambú',
  CHEST_COMPRESSION: 'CHEST_COMPRESSION',
  DEA: 'DEA',
  CARDIAC_MONITORING: 'Monitoriz. Cardíaca',
  DEFIBRILLATION: 'Desfribilação',
  CARDIPACEMAKERAC_MONITORING: 'Marcapassso',
  NECK_BRACE: 'Colar cervical',
  IMMOBILIZATION: 'Imobilização',
  MMSS: 'MMSS',
  MMII: 'MMII',
  OXIMETER: 'Oxímetro',
  CARDIOVERSION: 'Cardioversão',
  BANDAID: 'Curativo',
  RIGID_BOARD: 'Prancha rígida',
  QUICK_TAKE: 'Retirada rápida',
  HEATING: 'Aquecimento',
  VENOUS_ACCESS: 'Acesso venoso',
  BLEEDING_CONTROL: 'Controle de Hemorragia',
  KED: 'KED',
  OTHER: 'Outro',
}

export const RecordTableDetail = ({ record }: Props) => {
  return (
    <Wrapper>
      <Title>Informações Gerais</Title>
      <Grid container spacing={16}>
        <Grid item xs={2}>
          VTR: {record.vtr}
        </Grid>
        <Grid item xs={2}>
          Número da Ocorrência: {record.occurrenceNumber}
        </Grid>
        <Grid item xs={3}>
          Data: {dateFns.format(record.date, 'DD/MM/YYYY hh:mm')}
        </Grid>
        <Grid item xs={3}>
          Médico Regulador: {record.doctor}
        </Grid>
        <Grid item xs={3}>
          Motivo da Solicitação: {getRequestReason(record.requestReason)}
        </Grid>
      </Grid>
      <Title>Local da Ocorrência</Title>
      <Grid container spacing={16}>
        <Grid item xs={3}>
          Local da Ocorrência: {LOCATION[record.occurrenceLocation.location] || 'Outro'}
        </Grid>
        <Grid item xs={3}>
          Endereço: {record.occurrenceLocation.address}
        </Grid>
        <Grid item xs={3}>
          Número: {record.occurrenceLocation.addressNumber || 'S/N'}
        </Grid>
        <Grid item xs={3}>
          Bairro: {record.occurrenceLocation.neighborhood}
        </Grid>
        <Grid item xs={3}>
          Cidade: {record.occurrenceLocation.city}
        </Grid>
      </Grid>
      <Title>Situação do Local</Title>
      <Grid container spacing={16}>
        {record.locationSituation.map((cur: string) => (
          <Grid item xs={2} key={'location-situation-' + cur}>
            {LOCATION_SITUATION[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Situação da Vítima</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {VICTIM_SITUATION[record.victimSituation]}
        </Grid>
      </Grid>
      <Title>Intercorrências</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {COMPLICATIONS[record.complications]}
        </Grid>
      </Grid>
      <Title>Outros serviços no local</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.otherServices ? 'Sim' : 'Não'}
        </Grid>
      </Grid>
      <Title>Solicitação de Apoio</Title>
      <Grid container spacing={16}>
        {record.supportRequest.map((cur: string) => (
          <Grid item xs={2} key={'support-request-' + cur}>
            {SUPPORT_REQUEST[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Dados da Vítima</Title>
      <Grid container spacing={16}>
        <Grid item xs={3}>
          Nome: {record.victimData.name}
        </Grid>
        <Grid item xs={3}>
          Documento: {record.victimData.doc}
        </Grid>
        <Grid item xs={3}>
          Idade: {record.victimData.age}
        </Grid>
        <Grid item xs={3}>
          Sexo: {record.victimData.gender === 'F' ? 'Feminino' : 'Masculino'}
        </Grid>
        <Grid item xs={3}>
          Endereço: {record.victimData.address}
        </Grid>
        <Grid item xs={3}>
          Bairro: {record.victimData.neighborhood}
        </Grid>
        <Grid item xs={3}>
          Cidade: {record.victimData.city}
        </Grid>
        <Grid item xs={3}>
          Telefone: {record.victimData.phone}
        </Grid>
        <Grid item xs={3}>
          Nome do Acompanhante: {record.victimData.companion}
        </Grid>
        <Grid item xs={3}>
          Documento do Acompanhante: {record.victimData.companionDoc}
        </Grid>
        <Grid item xs={3}>
          Grau de Aproximidade: {record.victimData.companionProximityLevel}
        </Grid>
        <Grid item xs={3}>
          Telefone do Acompanhante: {record.victimData.companionPhone}
        </Grid>
      </Grid>
      <Title>Alergias</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {ALLERGY[record.allergy]}
        </Grid>
      </Grid>
      <Title>Medicamentos em uso</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {ALLERGY[record.medicinesInUse]}
        </Grid>
      </Grid>
      <Title>Antecedentes Pessoais</Title>
      <Grid container spacing={16}>
        {record.personalBackground.map((cur: string) => (
          <Grid item xs={2} key={'personal-background-' + cur}>
            {PERSONAL_BACKGROUND[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Mecanismo do Trauma</Title>
      <Grid container spacing={16}>
        {record.traumaMechanism.map((cur: string) => (
          <Grid item xs={2} key={'traume-mechanism-' + cur}>
            {TRAUMA_MECHANISM[cur]}
          </Grid>
        ))}
        <Grid item xs={3}>
          Paciente está responsivo: {record.responsive ? 'Sim' : 'Não'}
        </Grid>
        <Grid item xs={3}>
          Pulso: {PULSE[record.pulse]}
        </Grid>
      </Grid>
      <Title>Tipo de acidente de trânsito</Title>
      <Grid container spacing={16}>
        {record.accidentType.map((cur: string) => (
          <Grid item xs={2} key={'accident-type-' + cur}>
            {ACCIDENT_TYPE[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Posição da vítima no veículo</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {VICTIM_POSITION_IN_VEHICLE[record.victimPostionInVehicle]}
        </Grid>
      </Grid>
      <Title>Equipamento de segurança</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {SAFETY_EQUIPMENT[record.safetyEquipment]}
        </Grid>
      </Grid>
      <Title>Localização da vítima</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {VICTIM_SITUATION[record.victimSituation]}
        </Grid>
      </Grid>
      <Title>Deambulando</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.wandering ? 'Sim' : 'Não'}
        </Grid>
      </Grid>
      <Title>Veículo da vítima</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {VICTIM_VEHICLE[record.victimVehicle]}
        </Grid>
      </Grid>
      <Title>Outro envolvido</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {VICTIM_VEHICLE[record.otherInvolved]}
        </Grid>
      </Grid>
      <Title>Vias aéreas</Title>
      <Grid container spacing={16}>
        {record.airways.map((cur: string) => (
          <Grid item xs={2} key={'airways-' + cur}>
            {AIRWAYS[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Respiração</Title>
      <Grid container spacing={16}>
        {record.breath.map((cur: string) => (
          <Grid item xs={2} key={'breath-' + cur}>
            {BREATH[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Ausculta pulmonar</Title>
      <Grid container spacing={16}>
        {record.pulmonaryAuscultation.map((cur: string) => (
          <Grid item xs={2} key={'pulmonary-auscultation-' + cur}>
            {PULMONARY_AUSCULTATION[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Achados</Title>
      <Grid container spacing={16}>
        {record.findings.map((cur: string) => (
          <Grid item xs={2} key={'findings-' + cur}>
            {FINDINGS[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Pele</Title>
      <Grid container spacing={16}>
        {record.skin.map((cur: string) => (
          <Grid item xs={2} key={'skin-' + cur}>
            {SKIN[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Perfusão</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {INFUSION[record.infusion]}
        </Grid>
      </Grid>
      <Title>Ausculta Cardíaca</Title>
      <Grid container spacing={16}>
        {record.heartAuscultation.map((cur: string) => (
          <Grid item xs={2} key={'heart-auscultation-' + cur}>
            {HEART_AUSCULTATION[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Exame Neurológico</Title>
      <Grid container spacing={16}>
        {record.neurologicalExamination.map((cur: string) => (
          <Grid item xs={2} key={'neurological-examination-' + cur}>
            {NEUROLOGICAL_EXAMINATION[cur]}
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={16}>
        <Grid item xs={12} sm={4}>
          <Title>Otorragia</Title>
          {record.otorrhagia.join(' ')}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Title>Olhos de guaxinim</Title>
          {record.racoonEyes.join(' ')}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Title>Battle</Title>
          {record.battle.join(' ')}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Title>Déficit Motor</Title>
          {record.motorDeficit.join(' ')}
        </Grid>
        <Grid item xs={12} sm={4}>
          <Title>Rigidez de Nuca</Title>
          {record.stiffNeck ? 'Sim' : 'Não'}
        </Grid>
      </Grid>
      <Title>Pupilas</Title>
      <Grid container spacing={16}>
        {record.pupils.map((cur: string) => (
          <Grid item xs={2} key={'pupils-' + cur}>
            {PUPILS[cur]}
          </Grid>
        ))}
      </Grid>
      <Title>Procedimentos Realizados</Title>
      <Grid container spacing={16}>
        {Object.keys(record.performedProcedures)
          .filter(x => typeof record.performedProcedures[x] === 'boolean' && record.performedProcedures[x])
          .map((cur: string) => (
            <Grid item xs={2} key={'performed-procedures-' + cur}>
              {PERFORMED_PROCEDURES[cur] }
            </Grid>
          ))}
      </Grid>
    </Wrapper>
  )
}
