import { useState, useEffect, useRef } from 'react'

type AnyObject = { [x: string]: any }

export const useQuery = (method: Function, body?: Object) => {
  const [response, setResponse] = useState<AnyObject | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [isRefetching, setRefetching] = useState(false)
  const refetch = useRef((body?: AnyObject) => {})

  useEffect(() => {
    const query = (queryBody = body, isRefetch = false) => {
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
          setResponse(res)
        })
        .catch((err: Error) => {
          // @ts-ignore
          setError(err)
          setRefetching(false)
          setLoading(false)
          setResponse(null)
        })
    }

    refetch.current = (body?: AnyObject) => {
      query(body, true)
    }

    query(body, false)
  }, [])

  return { response, error, isLoading, isRefetching, refetch: refetch.current }
}
