import { useLocation, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'

export function useSearchParams() {
  const location = useLocation()
  const navigate = useNavigate()

  const params = useMemo(
    () => new URLSearchParams(location.search || ''),
    [location.search],
  )

  const setSearchParams = (next: any) => {
    let newSearch = ''
    if (typeof next === 'function') {
      const copy = new URLSearchParams(params.toString())
      const res = next(copy)
      newSearch = res.toString()
    } else if (next instanceof URLSearchParams) {
      newSearch = next.toString()
    } else if (typeof next === 'object') {
      const u = new URLSearchParams()
      Object.entries(next).forEach(([k, v]) => {
        if (v != null) u.set(k, String(v))
      })
      newSearch = u.toString()
    }

    const path = location.pathname + (newSearch ? `?${newSearch}` : '')
    navigate({ to: path })
  }

  return [params, setSearchParams] as const
}
