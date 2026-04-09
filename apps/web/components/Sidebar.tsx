'use client'

import { useState } from 'react'
import { ActionButtons } from './ActionButtons'
import { StudentList } from './StudentList'
import { RouteSummary } from './RouteSummary'
import { RouteKind, RouteResponse, StopPoint } from '../types/route'
import { Student, University } from '../types/student'
import { StudentForm } from './StudentForm'
import { CreateStudentPayload, UpdateStudentPayload } from '../services/students'
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
  routeGeneratedAt?: Date
  orderedStops: StopPoint[]
  onGenerate: (type: RouteKind) => void
  routeLoading: boolean
  routeError: string | null
  universities: University[]
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
  routeGeneratedAt,
  orderedStops,
  onGenerate,
  routeLoading,
  routeError,
  universities,
}: Props) {
  const [showForm, setShowForm] = useState(false)

  const editingStudent = editingStudentId
    ? students.find(s => s.id === editingStudentId)
    : null

  const handleStudentSubmit = async (payload: CreateStudentPayload) => {
    if (editingStudentId) {
      await onEditStudent(editingStudentId, payload)
      setEditingStudentId(null)
    } else {
      await onAddStudent(payload)
      setShowForm(false)
    }
  }

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="header">
        <div>
          <div className="title">SmartRoute</div>
          <p className="header-sub">Rotas otimizadas de ida e volta.</p>
        </div>
        <span className="badge">Beta</span>
      </div>

      {/* Rotas */}
      <div className="sidebar-section">
        <div className="section-title">Gerar Rota</div>
        <ActionButtons onGenerate={onGenerate} loading={routeLoading} error={routeError} />
      </div>

      {/* Resumo */}
      <div className="sidebar-section">
        <div className="section-title">Resumo</div>
        <RouteSummary route={route} orderedStops={orderedStops} generatedAt={routeGeneratedAt} />
      </div>

      {/* Alunos */}
      <div className="sidebar-section">
        <div className="section-title-row">
          <div className="section-title">Alunos</div>
          <IconButton
            label={showForm || editingStudentId ? 'Fechar formulário de aluno' : 'Adicionar aluno'}
            onClick={() => {
              setShowForm(current => {
                if (editingStudentId) {
                  setEditingStudentId(null)
                  return false
                }
                return !current
              })
            }}
          >
            {showForm || editingStudentId ? '−' : '+'}
          </IconButton>
        </div>

        {showForm || editingStudentId ? (
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
