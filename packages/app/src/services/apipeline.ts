import APIpeline from 'apipeline'
import localforage from 'localforage'
import clientFetch from 'unfetch'

import { Auth } from './auth'

const normalizeEndpoint = (endpoint: string) => {
  if (endpoint.endsWith('/')) {
    return endpoint.substring(0, endpoint.length - 1)
  }

  return endpoint
}

const API_OPTIONS = {
  fetchMethod: clientFetch,
  domains: { default: normalizeEndpoint(process.env.REACT_APP_ENDPOINT as string) },
  prefixes: { default: '' },
  printNetworkRequests: process.env.NODE_ENV !== 'production',
  debugAPI: process.env.NODE_ENV !== 'production',
  disableCache: false,
  middlewares: [
    () => ({
      headers: {
        Accept: 'application/json',
        Authorization: Auth.getAuthToken(),
        'Content-Type': 'application/json; charset=utf-8',
      },
    }),
  ],
  networkFirst: true,
}

const API_SERVICES = {
  'get-medical-records': { path: 'medical-records', responseMiddleware: res => ({ ...res, timestamp: Date.now() }) },
  login: {
    path: 'auth/login',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    disableCache: true,
    method: 'POST',
  },
  'insert-medical-records': {
    path: 'medical-records',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    disableCache: true,
    method: 'POST',
  },
  'delete-medical-records': {
    path: 'medical-records/:id',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    disableCache: true,
    method: 'DELETE',
  },
  'medical-records-analytics': {
    path: 'medical-records/analytics',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
  },
  'generate-medical-records-report': {
    path: 'medical-records/report',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    method: 'POST',
  },
  'list-users': {
    path: 'users',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    method: 'GET',
  },
  'toggle-admin': {
    path: 'users/toggle-admin',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    method: 'POST',
  },
  'create-user': {
    path: 'users',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    method: 'POST',
  },
  'delete-user': {
    path: 'users/:id',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    disableCache: true,
    method: 'DELETE',
  },
  'current-user': {
    path: 'users/current',
    responseMiddleware: res => ({ ...res, timestamp: Date.now() }),
    method: 'GET',
  },
}

// @ts-ignore
export const api = new APIpeline(API_OPTIONS, API_SERVICES, localforage)
