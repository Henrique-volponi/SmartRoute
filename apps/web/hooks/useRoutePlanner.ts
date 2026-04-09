import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createStudent,
  deleteStudent,
  fetchStudents,
  CreateStudentPayload,
} from '../services/students'
import { generateRoute } from '../services/routes'
import { RouteKind, RouteResponse, StopPoint } from '../types/route'
import { Student } from '../types/student'
import { updateStudent, UpdateStudentPayload } from '../services/students'
import { extractApiError } from '../utils/apiError'

interface UseRoutePlannerResult {
  students: Student[]
  studentsLoading: boolean
  route?: RouteResponse
  routeGeneratedAt?: Date
  routeLoading: boolean
  routeError: string | null
  orderedStops: StopPoint[]
  studentSaving: boolean
  studentDeletingId: string | null
  studentError: string | null
  editingStudentId: string | null
  editStudent: (id: string, payload: UpdateStudentPayload) => Promise<void>
  setEditingStudentId: (id: string | null) => void
  loadStudents: () => Promise<void>
  requestRoute: (type: RouteKind) => Promise<void>
  addStudent: (payload: CreateStudentPayload) => Promise<void>
  removeStudent: (id: string) => Promise<void>
}

export function useRoutePlanner(): UseRoutePlannerResult {
  const [students, setStudents] = useState<Student[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [route, setRoute] = useState<RouteResponse | undefined>(undefined)
  const [routeGeneratedAt, setRouteGeneratedAt] = useState<Date | undefined>(undefined)
  const [routeLoading, setRouteLoading] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [studentSaving, setStudentSaving] = useState(false)
  const [studentDeletingId, setStudentDeletingId] = useState<string | null>(null)
  const [studentError, setStudentError] = useState<string | null>(null)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)

  const loadStudents = useCallback(async () => {
    setStudentsLoading(true)
    try {
      const list = await fetchStudents()
      setStudents(list)
    } catch (err) {
      console.error('Erro ao buscar estudantes', err)
    } finally {
      setStudentsLoading(false)
    }
  }, [])

  const requestRoute = useCallback(async (type: RouteKind) => {
    setRouteLoading(true)
    setRouteError(null)
    const clickedAt = new Date()
    try {
      const result = await generateRoute(type)
      setRoute(result)
      setRouteGeneratedAt(clickedAt)
    } catch (err) {
      console.error('Erro ao gerar rota', err)
      setRouteError(extractApiError(err, 'Não foi possível gerar a rota. Tente novamente.'))
    } finally {
      setRouteLoading(false)
    }
  }, [])

  const addStudent = useCallback(
    async (payload: CreateStudentPayload) => {
      setStudentSaving(true)
      try {
        await createStudent(payload)
        await loadStudents()
        setRoute(undefined)
        setRouteGeneratedAt(undefined)
      } catch (err) {
        console.error('Erro ao criar estudante', err)
        throw err
      } finally {
        setStudentSaving(false)
      }
    },
    [loadStudents]
  )

  const editStudent = useCallback(
    async (id: string, payload: UpdateStudentPayload) => {
      setStudentSaving(true)
      try {
        await updateStudent(id, payload)
        await loadStudents()
        setRoute(undefined)
        setEditingStudentId(null)
      } catch (err) {
        console.error('Erro ao atualizar estudante', err)
        throw err
      } finally {
        setStudentSaving(false)
      }
    },
    [loadStudents]
  )

  const removeStudent = useCallback(
    async (id: string) => {
      setStudentError(null)
      setStudentDeletingId(id)
      try {
        await deleteStudent(id)
        await loadStudents()
        setRoute(undefined)
      } catch (err) {
        console.error('Erro ao remover estudante', err)
        setStudentError('Não foi possível remover o aluno. Tente novamente.')
      } finally {
        setStudentDeletingId(null)
      }
    },
    [loadStudents]
  )

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  const orderedStops = useMemo<StopPoint[]>(() => {
    if (!students.length) return []

    const baseStops: StopPoint[] = []

    const firstStudent = students[0]
    const university = firstStudent?.university

    const addUniversity = () => {
      if (!university) return
      baseStops.push({
        label: university.name,
        lat: university.latitude,
        lng: university.longitude,
        kind: 'university',
      })
    }

    const addStudents = () => {
      students.forEach(s => {
        baseStops.push({
          label: s.name,
          lat: s.latitude,
          lng: s.longitude,
          kind: 'student',
        })
      })
    }

    if (route?.type === 'IDA') {
      addStudents()
      addUniversity()
    } else {
      addUniversity()
      addStudents()
    }

    if (!route?.optimizedOrder?.length) return baseStops

    return route.optimizedOrder.reduce<StopPoint[]>((acc, idx, order) => {
      const stop = baseStops[idx]
      if (!stop) return acc
      acc.push({ ...stop, order: order + 1 })
      return acc
    }, [])
  }, [route, students])

  return {
    students,
    studentsLoading,
    route,
    routeGeneratedAt,
    routeLoading,
    routeError,
    orderedStops,
    studentSaving,
    studentDeletingId,
    studentError,
    loadStudents,
    requestRoute,
    addStudent,
    editStudent,
    removeStudent,
    editingStudentId,
    setEditingStudentId,
  }
}
