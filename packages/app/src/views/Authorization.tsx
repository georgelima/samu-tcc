import React, { useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { Paper, Button, Typography, IconButton } from '@material-ui/core'
import { AccountCircleOutlined, VpnKeyOutlined, VisibilityOff, Visibility } from '@material-ui/icons'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { sha256 } from 'js-sha256'

import { TextInput } from '../components/TextInput'

import { Auth } from '../services/auth'
import * as Service from '../services/api'

type State = {
  showPassword: boolean
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to right, #f34e32, #ba3030);
  display: flex;
  justify-content: center;
  align-items: center;
`

const Heading = styled(Typography)`
  && {
    color: red;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`

const Error = styled(Typography)`
  && {
    color: red;
    text-align: center;
    margin-bottom: 10px;
  }
`

const Card = styled.div`
  padding: 30px;
  width: 35vw;
`

const Field = styled(TextInput)`
  && {
    margin-bottom: 10px;
  }
`

export const Authorization = (props: RouteComponentProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={Yup.object().shape({
        cpf: Yup.string().required('Campo obrigatório'),
        password: Yup.string().required('Campo obrigatório'),
      })}
      initialValues={{
        cpf: '',
        password: '',
      }}
      onSubmit={({ cpf, password }, { setStatus, setSubmitting }) =>
        Service.login({ cpf, password: sha256(password) })
          .then(res => {
            setSubmitting(false)
            if (res.error || !res.token) {
              setStatus('Credenciais inválidas!')
              return
            }

            Auth.authenticate(res.token)
            props.history.push('/')
          })
          .catch(err => {
            setSubmitting(false)
            setStatus('Algo deu errado, tente novamente!')
          })
      }
    >
      {({ values, setFieldValue, handleSubmit, isSubmitting, errors, status }) => (
        <form onSubmit={handleSubmit}>
          <Wrapper>
            <Paper>
              Credenciais para teste <br />
              cpf: 123.456.789-00 password: 123456
              <Heading variant='h4'>WebSAMU</Heading>
              <Card>
                <Field
                  mask='999.999.999-99'
                  name='cpf'
                  handleChange={setFieldValue}
                  label='CPF'
                  value={values.cpf}
                  errors={errors}
                  startAdornment={<AccountCircleOutlined />}
                />
                <Field
                  name='password'
                  handleChange={setFieldValue}
                  label='Senha'
                  value={values.password}
                  errors={errors}
                  type={showPassword ? 'text' : 'password'}
                  startAdornment={<VpnKeyOutlined />}
                  endAdornment={
                    <IconButton aria-label='Toggle password visibility' onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                />
                {status && <Error variant='caption'>{status}</Error>}
                <Button
                  type='submit'
                  fullWidth
                  variant='outlined'
                  style={{ alignSelf: 'flex-end' }}
                  disabled={isSubmitting}
                  id='submit-medical-record-button'
                  onClick={() => handleSubmit()}
                >
                  {isSubmitting ? 'Autenticando...' : 'Entrar'}
                </Button>
              </Card>
            </Paper>
          </Wrapper>
        </form>
      )}
    </Formik>
  )
}
