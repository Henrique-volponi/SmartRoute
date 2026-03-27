'use client'

import { useCallback, useEffect, useState } from 'react'
import { ActionButtons } from './ActionButtons'
import { StudentList } from './StudentList'
import { RouteSummary } from './RouteSummary'
import { RouteKind, RouteResponse, StopPoint } from '../types/route'
import { Student } from '../types/student'
import { StudentForm } from './StudentForm'
import { fetchUniversities } from '../services/universities'
import { CreateStudentPayload, UpdateStudentPayload } from '../services/students'
import { University } from '../types/student'
import { IconButton } from './IconButton'

interface Props {
  students: Student[]
  studentsLoading: boolean
  onAddStudent: (payload: CreateStudentPayload) => Promise<void>
  onEditStudent: (id: string, payload: UpdateStudentPayload) => Promise<void>
  editingStudentId: string | null
  setEditingStudentId: (id: string | null) => void
  studentSaving: boolean
  onDeleteStudent: (id: string) => Promise<void>
  studentDeletingId: string | null
  studentError: string | null
  route?: RouteResponse
  orderedStops: StopPoint[]
  onGenerate: (type: RouteKind) => void
  routeLoading: boolean
}

export function Sidebar({
  students,
  studentsLoading,
  onAddStudent,
  onEditStudent,
  editingStudentId,
  setEditingStudentId,
  studentSaving,
  onDeleteStudent,
  studentDeletingId,
  studentError,
  route,
  orderedStops,
  onGenerate,
  routeLoading,
}: Props) {
  const [showForm, setShowForm] = useState(false)
  const [universities, setUniversities] = useState<University[]>([])
  const [universitiesLoading, setUniversitiesLoading] = useState(false)

  const editingStudent = editingStudentId
    ? students.find(s => s.id === editingStudentId)
    : null

  const loadUniversities = useCallback(async () => {
    setUniversitiesLoading(true)
    try {
      const list = await fetchUniversities()
      setUniversities(list)
    } catch (err) {
      console.error('Erro ao carregar universidades', err)
    } finally {
      setUniversitiesLoading(false)
    }
  }, [])

  useEffect(() => {
    if ((showForm || editingStudentId) && !universities.length && !universitiesLoading) {
      void loadUniversities()
    }
  }, [
    showForm,
    editingStudentId,
    universities.length,
    universitiesLoading,
    loadUniversities,
  ])

  const handleStudentSubmit = useCallback(
    async (payload: CreateStudentPayload) => {
      if (editingStudentId) {
        await onEditStudent(editingStudentId, payload)
        setEditingStudentId(null)
      } else {
        await onAddStudent(payload)
        setShowForm(false)
      }
    },
    [editingStudentId, onAddStudent, onEditStudent, setEditingStudentId]
  )

  return (
    <aside className="sidebar">
      <div className="header">
        <div>
          <div className="title">SmartRoute</div>
          <p className="muted" style={{ marginTop: 4 }}>
            Gere rotas otimizadas de ida e volta.
          </p>
        </div>
        <span className="badge">Beta</span>
      </div>

      <ActionButtons onGenerate={onGenerate} loading={routeLoading} />

      <div>
        <div className="section-title">Resumo</div>
        <RouteSummary route={route} orderedStops={orderedStops} />
      </div>

      <div>
        <div className="section-title-row">
          <div className="section-title">Alunos</div>
          <IconButton
            label={
              showForm || editingStudentId
                ? 'Fechar formulário de aluno'
                : 'Adicionar aluno'
            }
            onClick={() => {
              setShowForm(current => {
                if (editingStudentId) {
                  setEditingStudentId(null)
                  return false
                }
                return !current
              })
            }}
            style={{ marginBottom: 8 }}
          >
            {showForm || editingStudentId ? '-' : '+'}
          </IconButton>
        </div>
        {showForm || editingStudentId ? (
          universitiesLoading ? (
            <div className="muted" style={{ padding: 12 }}>
              Carregando universidades…
            </div>
          ) : (
            <StudentForm
              universities={universities}
              loading={studentSaving}
              onSubmit={handleStudentSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingStudentId(null)
              }}
              initialData={editingStudent}
            />
          )
        ) : null}
        <StudentList
          students={students}
          loading={studentsLoading}
          onEdit={id => {
            setShowForm(false)
            setEditingStudentId(id)
          }}
          onDelete={onDeleteStudent}
          deletingId={studentDeletingId}
          error={studentError}
        />
      </div>
    </aside>
  )
}
