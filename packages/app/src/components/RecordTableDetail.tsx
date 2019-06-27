import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@material-ui/core'

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

export const RecordTableDetail = ({ record }: Props) => {
  console.log(record)
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
          Data: {record.date}
        </Grid>
        <Grid item xs={3}>
          Médico Regulador: {record.doctor}
        </Grid>
        <Grid item xs={3}>
          Motivo da Solicitação: {record.requestReason}
        </Grid>
      </Grid>
      <Title>Local da Ocorrência</Title>
      <Grid container spacing={16}>
        <Grid item xs={3}>
          Local da Ocorrência: {record.occurrenceLocation.location}
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
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Situação da Vítima</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.victimSituation}
        </Grid>
      </Grid>
      <Title>Intercorrências</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.complications}
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
            {cur}
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
          Sexo: {record.victimData.gender}
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
          {record.allergy}
        </Grid>
      </Grid>
      <Title>Medicamentos em uso</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.medicinesInUse}
        </Grid>
      </Grid>
      <Title>Antecedentes Pessoais</Title>
      <Grid container spacing={16}>
        {record.personalBackground.map((cur: string) => (
          <Grid item xs={2} key={'personal-background-' + cur}>
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Mecanismo do Trauma</Title>
      <Grid container spacing={16}>
        {record.traumaMechanism.map((cur: string) => (
          <Grid item xs={2} key={'traume-mechanism-' + cur}>
            {cur}
          </Grid>
        ))}
        <Grid item xs={3}>
          Paciente está responsivo: {record.responsive ? 'Sim' : 'Não'}
        </Grid>
        <Grid item xs={3}>
          Pulso: {record.pulse}
        </Grid>
      </Grid>
      <Title>Tipo de acidente de trânsito</Title>
      <Grid container spacing={16}>
        {record.accidentType.map((cur: string) => (
          <Grid item xs={2} key={'accident-type-' + cur}>
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Posição da vítima no veículo</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.victimPostionInVehicle}
        </Grid>
      </Grid>
      <Title>Equipamento de segurança</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.safetyEquipment}
        </Grid>
      </Grid>
      <Title>Localização da vítima</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.victimSituation}
        </Grid>
      </Grid>
      <Title>Deambulando</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.wandering}
        </Grid>
      </Grid>
      <Title>Veículo da vítima</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.victimVehicle}
        </Grid>
      </Grid>
      <Title>Outro envolvido</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.otherInvolved}
        </Grid>
      </Grid>
      <Title>Vias aéreas</Title>
      <Grid container spacing={16}>
        {record.airways.map((cur: string) => (
          <Grid item xs={2} key={'airways-' + cur}>
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Respiração</Title>
      <Grid container spacing={16}>
        {record.breath.map((cur: string) => (
          <Grid item xs={2} key={'breath-' + cur}>
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Ausculta pulmonar</Title>
      <Grid container spacing={16}>
        {record.pulmonaryAuscultation.map((cur: string) => (
          <Grid item xs={2} key={'pulmonary-auscultation-' + cur}>
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Achados</Title>
      <Grid container spacing={16}>
        {record.findings.map((cur: string) => (
          <Grid item xs={2} key={'findings-' + cur}>
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Pele</Title>
      <Grid container spacing={16}>
        {record.skin.map((cur: string) => (
          <Grid item xs={2} key={'skin-' + cur}>
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Perfusão</Title>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          {record.infusion}
        </Grid>
      </Grid>
      <Title>Ausculta Cardíaca</Title>
      <Grid container spacing={16}>
        {record.heartAuscultation.map((cur: string) => (
          <Grid item xs={2} key={'heart-auscultation-' + cur}>
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Exame Neurológico</Title>
      <Grid container spacing={16}>
        {record.neurologicalExamination.map((cur: string) => (
          <Grid item xs={2} key={'neurological-examination-' + cur}>
            {cur}
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
            {cur}
          </Grid>
        ))}
      </Grid>
      <Title>Procedimentos Realizados</Title>
      <Grid container spacing={16}>
        {Object.keys(record.performedProcedures)
          .filter(x => typeof record.performedProcedures[x] === 'boolean' && record.performedProcedures[x])
          .map((cur: string) => (
            <Grid item xs={2} key={'performed-procedures-' + cur}>
              {cur}
            </Grid>
          ))}
      </Grid>
    </Wrapper>
  )
}
