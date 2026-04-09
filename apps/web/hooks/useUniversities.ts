import { useCallback, useEffect, useState } from 'react'
import { fetchUniversities } from '../services/universities'
import { University } from '../types/student'

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>([])

  const reload = useCallback(async () => {
    try {
      const list = await fetchUniversities()
      setUniversities(list)
    } catch (err) {
      console.error('Erro ao buscar universidades', err)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { universities, reload }
}
