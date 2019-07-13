import React from 'react'
import styled from 'styled-components'
import { Formik, Form } from 'formik'
import { RouteComponentProps } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  DialogActions,
  IconButton,
} from '@material-ui/core'
import { Edit, Delete } from '@material-ui/icons'
import formatCPF from '@brazilian-utils/format-cpf'
import * as Yup from 'yup'
import { sha256 } from 'js-sha256'

import { Layout } from '../components/Layout'
import { Checkbox } from '../components/Checkbox'
import { ErrorComponent } from '../components/Error'
import { FullLoader } from '../components/FullLoader'
import { Modal } from '../components/Modal'
import { TextInput } from '../components/TextInput'

import { useQuery } from '../hooks/useQuery'

import { listUsers, toggleAdmin, createUser, deleteUser } from '../services/api'

const ButtonWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`

const FormWrapper = styled.div`
  padding: 20px;
`

export const Users = (props: RouteComponentProps) => {
  const { error, isLoading, response: data, refetch } = useQuery(listUsers, {})

  return (
    <Layout {...props}>
      {isLoading ? (
        <FullLoader />
      ) : error || !data ? (
        <ErrorComponent message={(error && error.message) || 'Algo deu errado'} />
      ) : (
        <>
          <Modal
            title="Adicionar novo usuário"
            trigger={({ open }) => (
              <ButtonWrapper>
                <Button onClick={open} variant="contained" color="primary">
                  Adicionar usuário
                </Button>
              </ButtonWrapper>
            )}
          >
            {({ close }) => (
              <FormWrapper>
                <Formik
                  validateOnChange={false}
                  validateOnBlur={false}
                  validationSchema={Yup.object().shape({
                    name: Yup.string().required('Campo obrigatório'),
                    cpf: Yup.string().required('Campo obrigatório'),
                    password: Yup.string().required('Campo obrigatório'),
                    isAdmin: Yup.bool().required('Campo obrigatório'),
                  })}
                  initialValues={{
                    name: '',
                    cpf: '',
                    password: '',
                    isAdmin: false,
                  }}
                  onSubmit={({ name, cpf, password, isAdmin }, { setSubmitting }) => {
                    createUser({
                      name,
                      cpf,
                      password: sha256(password),
                      isAdmin,
                    })
                      .then(() => {
                        refetch()
                        setSubmitting(false)
                        close()
                      })
                      .catch(() => {
                        setSubmitting(false)
                        close()
                      })
                  }}
                >
                  {({ values, setFieldValue, errors, handleSubmit, isSubmitting }) => (
                    <Form>
                      <TextInput
                        name="name"
                        handleChange={setFieldValue}
                        label="Nome"
                        value={values.name}
                        errors={errors}
                        margin="normal"
                      />
                      <TextInput
                        mask="999.999.999-99"
                        name="cpf"
                        handleChange={setFieldValue}
                        label="CPF"
                        value={values.cpf}
                        errors={errors}
                        margin="normal"
                      />
                      <TextInput
                        name="password"
                        handleChange={setFieldValue}
                        label="Senha"
                        value={values.password}
                        errors={errors}
                        margin="normal"
                        type="password"
                      />
                      <Checkbox
                        name="isAdmin"
                        handleChange={name => setFieldValue(name, !values.isAdmin)}
                        checked={values.isAdmin}
                        label="Administrador?"
                      />
                      <DialogActions>
                        <Button variant="outlined" onClick={close} color="primary" disabled={isSubmitting}>
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleSubmit()}
                          color="primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Aguarde...' : 'Confirmar'}
                        </Button>
                      </DialogActions>
                    </Form>
                  )}
                </Formik>
              </FormWrapper>
            )}
          </Modal>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">Administrador</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.users || []).map(user => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Checkbox
                        name="isAdmin"
                        label=""
                        checked={user.isAdmin}
                        handleChange={() => toggleAdmin({ userId: user._id }).then(() => refetch())}
                        uncontrolled
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{formatCPF(user.cpf)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          deleteUser(user._id).then(() => {
                            refetch()
                          })
                        }
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Layout>
  )
}
