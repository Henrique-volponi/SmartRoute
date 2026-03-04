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

interface UseRoutePlannerResult {
  students: Student[]
  studentsLoading: boolean
  route?: RouteResponse
  routeLoading: boolean
  orderedStops: StopPoint[]
  studentSaving: boolean
  studentDeletingId: string | null
  loadStudents: () => Promise<void>
  requestRoute: (type: RouteKind) => Promise<void>
  addStudent: (payload: CreateStudentPayload) => Promise<void>
  removeStudent: (id: string) => Promise<void>
}

export function useRoutePlanner(): UseRoutePlannerResult {
  const [students, setStudents] = useState<Student[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [route, setRoute] = useState<RouteResponse | undefined>(undefined)
  const [routeLoading, setRouteLoading] = useState(false)
  const [studentSaving, setStudentSaving] = useState(false)
  const [studentDeletingId, setStudentDeletingId] = useState<string | null>(null)

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
    try {
      const result = await generateRoute(type)
      setRoute(result)
    } catch (err) {
      console.error('Erro ao gerar rota', err)
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
      } catch (err) {
        console.error('Erro ao criar estudante', err)
        throw err
      } finally {
        setStudentSaving(false)
      }
    },
    [loadStudents]
  )

  const removeStudent = useCallback(
    async (id: string) => {
      setStudentDeletingId(id)
      try {
        await deleteStudent(id)
        await loadStudents()
        setRoute(undefined)
      } catch (err) {
        console.error('Erro ao remover estudante', err)
        throw err
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
    routeLoading,
    orderedStops,
    studentSaving,
    studentDeletingId,
    loadStudents,
    requestRoute,
    addStudent,
    removeStudent,
  }
}
