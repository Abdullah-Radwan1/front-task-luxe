import { useLocation, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'

/**
 * Custom hook to manage URL Search Parameters in a TanStack Router environment.
 * It provides a way to read current parameters and a function to update them.
 */
export function useSearchParams() {
  // Access the current location object (contains pathname, search, etc.)
  const location = useLocation()

  // Access the navigation function to change the URL programmatically
  const navigate = useNavigate()

  /**
   * Memoized search parameters object.
   * It converts the location search string into a web-standard URLSearchParams object.
   * We use 'as unknown as string' because TanStack sometimes treats search as a parsed object.
   */
  const params = useMemo(
    () => new URLSearchParams(location.search as unknown as string),
    [location.search],
  )

  /**
   * Type definition for the input accepted by the update function.
   * It supports strings, existing URLSearchParams, Objects (with strings/numbers), or a callback function.
   */
  type ParamInput =
    | string
    | URLSearchParams
    | Record<string, string | number | boolean | undefined | null>
    | ((prev: URLSearchParams) => URLSearchParams)

  /**
   * The core function to update the URL Search Parameters.
   * It processes the input, converts it to a query string, and triggers a navigation.
   */
  const setSearchParams = (next: ParamInput) => {
    let newSearch = ''

    // Case 1: If the input is a function (e.g., prev => prev.set('key', 'value'))
    if (typeof next === 'function') {
      const copy = new URLSearchParams(params.toString())
      newSearch = next(copy).toString()
    }
    // Case 2: If the input is already a URLSearchParams instance
    else if (next instanceof URLSearchParams) {
      newSearch = next.toString()
    }
    // Case 3: If the input is a plain Object (e.g., { page: 1, category: 'shoes' })
    else if (typeof next === 'object' && next !== null) {
      const u = new URLSearchParams()
      Object.entries(next).forEach(([key, value]) => {
        // Only append to search if the value is not null or undefined
        if (value !== undefined && value !== null) {
          // Explicitly convert value to String to avoid TypeScript 'number' errors
          u.set(key, String(value))
        }
      })
      newSearch = u.toString()
    }
    // Case 4: If the input is a raw string (e.g., "page=1&sort=desc")
    else if (typeof next === 'string') {
      newSearch = next
    }

    /**
     * Combine the current pathname with the new query string.
     * If newSearch is empty, it removes the '?' from the URL.
     */
    const path = location.pathname + (newSearch ? `?${newSearch}` : '')

    // Execute the navigation to the new path
    navigate({ to: path })
  }

  /**
   * Returns a tuple containing the params object and the setter function.
   * 'as const' ensures TypeScript treats this as a specific Tuple rather than a general Array.
   */
  return [params, setSearchParams] as const
}
