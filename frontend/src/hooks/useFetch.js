import { useCallback, useEffect, useRef, useState } from 'react'

export const useFetch = (fetcher, options = {}) => {
  const { immediate = true, initialData = null } = options
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(Boolean(immediate))
  const [error, setError] = useState(null)
  const isMountedRef = useRef(false)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetcher()
      if (!isMountedRef.current) {
        return null
      }
      setData(response)
      return response
    } catch (err) {
      if (!isMountedRef.current) {
        return null
      }
      setError(err)
      return null
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [fetcher])

  useEffect(() => {
    isMountedRef.current = true
    if (immediate) {
      execute()
    }
    return () => {
      isMountedRef.current = false
    }
  }, [immediate, execute])

  return { data, setData, loading, error, refetch: execute }
}

export default useFetch
