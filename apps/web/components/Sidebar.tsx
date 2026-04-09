'use client'

import { useState } from 'react'
import { ActionButtons } from './ActionButtons'
import { StudentList } from './StudentList'
import { StudentForm } from './StudentForm'
import { UniversityForm } from './UniversityForm'
import { UniversityList } from './UniversityList'
import { RouteSummary } from './RouteSummary'
import { IconButton } from './IconButton'
import { RouteKind, RouteResponse, StopPoint } from '../types/route'
import { Student, University } from '../types/student'
import { CreateStudentPayload, UpdateStudentPayload } from '../services/students'
import { CreateUniversityPayload } from '../services/universities'

interface Props {
  // students
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
  // universities
  universities: University[]
  universitiesLoading: boolean
  universitySaving: boolean
  universityDeletingId: string | null
  universityError: string | null
  onAddUniversity: (payload: CreateUniversityPayload) => Promise<void>
  onDeleteUniversity: (id: string) => Promise<void>
  // route
  route?: RouteResponse
  routeGeneratedAt?: Date
  orderedStops: StopPoint[]
  onGenerate: (type: RouteKind) => void
  routeLoading: boolean
  routeError: string | null
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
  universities,
  universitiesLoading,
  universitySaving,
  universityDeletingId,
  universityError,
  onAddUniversity,
  onDeleteUniversity,
  route,
  routeGeneratedAt,
  orderedStops,
  onGenerate,
  routeLoading,
  routeError,
}: Props) {
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [showUniversityForm, setShowUniversityForm] = useState(false)

  const editingStudent = editingStudentId
    ? students.find(s => s.id === editingStudentId)
    : null

  const handleStudentSubmit = async (payload: CreateStudentPayload) => {
    if (editingStudentId) {
      await onEditStudent(editingStudentId, payload)
      setEditingStudentId(null)
    } else {
      await onAddStudent(payload)
      setShowStudentForm(false)
    }
  }

  const handleUniversitySubmit = async (payload: CreateUniversityPayload) => {
    await onAddUniversity(payload)
    setShowUniversityForm(false)
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

      {/* Gerar Rota */}
      <div className="sidebar-section">
        <div className="section-title">Gerar Rota</div>
        <ActionButtons onGenerate={onGenerate} loading={routeLoading} error={routeError} />
      </div>

      {/* Resumo */}
      <div className="sidebar-section">
        <div className="section-title">Resumo</div>
        <RouteSummary route={route} orderedStops={orderedStops} generatedAt={routeGeneratedAt} />
      </div>

      {/* Universidades */}
      <div className="sidebar-section">
        <div className="section-title-row">
          <div className="section-title">Universidades</div>
          <IconButton
            label={showUniversityForm ? 'Fechar formulário' : 'Adicionar universidade'}
            onClick={() => setShowUniversityForm(v => !v)}
          >
            {showUniversityForm ? '−' : '+'}
          </IconButton>
        </div>

        {showUniversityForm ? (
          <UniversityForm
            loading={universitySaving}
            onSubmit={handleUniversitySubmit}
            onCancel={() => setShowUniversityForm(false)}
          />
        ) : null}

        <UniversityList
          universities={universities}
          loading={universitiesLoading}
          onDelete={onDeleteUniversity}
          deletingId={universityDeletingId}
          error={universityError}
        />
      </div>

      {/* Alunos */}
      <div className="sidebar-section">
        <div className="section-title-row">
          <div className="section-title">Alunos</div>
          <IconButton
            label={showStudentForm || editingStudentId ? 'Fechar formulário' : 'Adicionar aluno'}
            onClick={() => {
              setShowStudentForm(current => {
                if (editingStudentId) {
                  setEditingStudentId(null)
                  return false
                }
                return !current
              })
            }}
          >
            {showStudentForm || editingStudentId ? '−' : '+'}
          </IconButton>
        </div>

        {showStudentForm || editingStudentId ? (
          <StudentForm
            universities={universities}
            loading={studentSaving}
            onSubmit={handleStudentSubmit}
            onCancel={() => {
              setShowStudentForm(false)
              setEditingStudentId(null)
            }}
            initialData={editingStudent}
          />
        ) : null}

        <StudentList
          students={students}
          loading={studentsLoading}
          onEdit={id => {
            setShowStudentForm(false)
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
