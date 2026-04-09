import { useCallback, useEffect, useState } from 'react'
import {
  fetchUniversities,
  createUniversity,
  deleteUniversity,
  CreateUniversityPayload,
} from '../services/universities'
import { University } from '../types/student'
import { extractApiError } from '../utils/apiError'

interface UseUniversitiesResult {
  universities: University[]
  loading: boolean
  saving: boolean
  deletingId: string | null
  error: string | null
  reload: () => Promise<void>
  add: (payload: CreateUniversityPayload) => Promise<void>
  remove: (id: string) => Promise<void>
}

export function useUniversities(): UseUniversitiesResult {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const list = await fetchUniversities()
      setUniversities(list)
    } catch (err) {
      console.error('Erro ao buscar universidades', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const add = useCallback(async (payload: CreateUniversityPayload) => {
    setSaving(true)
    try {
      await createUniversity(payload)
      await reload()
    } catch (err) {
      console.error('Erro ao criar universidade', err)
      throw err
    } finally {
      setSaving(false)
    }
  }, [reload])

  const remove = useCallback(async (id: string) => {
    setError(null)
    setDeletingId(id)
    try {
      await deleteUniversity(id)
      await reload()
    } catch (err) {
      setError(extractApiError(err, 'Não foi possível remover a universidade.'))
    } finally {
      setDeletingId(null)
    }
  }, [reload])

  useEffect(() => {
    reload()
  }, [reload])

  return { universities, loading, saving, deletingId, error, reload, add, remove }
}
