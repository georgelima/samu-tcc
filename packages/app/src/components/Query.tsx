import React, { useState, useEffect, useRef } from 'react'

type State = {
  isLoading: boolean
  isRefetching: boolean
  error: Error | null
  data: { [key: string]: any } | null
}

type Props = {
  children: (st: State & { refetch: Function }) => React.ReactElement | null
  method: Function
  body?: Object
}

const initialState = {
  isLoading: true,
  isRefetching: false,
  error: null,
  data: null,
}

export const Query = ({ body, method, children }: Props) => {
  const query = useRef((body: any, isRefetch: boolean) => {})

  const [isLoading, setLoading] = useState(false)
  const [isRefetching, setRefetching] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    query.current = (queryBody = body, isRefetch = false) => {
      if (isRefetch) {
        setRefetching(true)
        setLoading(false)
      } else {
        setRefetching(false)
        setLoading(true)
      }
      method(queryBody)
        .then((res: { [key: string]: any }) => {
          setError(null)
          setRefetching(false)
          setLoading(false)
          // @ts-ignore
          setData(res)
        })
        .catch((err: Error) => {
          // @ts-ignore
          setError(err)
          setRefetching(false)
          setLoading(false)
          setData(null)
        })
    }

    query.current(body, false)
  }, [])

  return children({ isLoading, isRefetching, error, data, refetch: (body: any) => query.current(body, true) })
}
