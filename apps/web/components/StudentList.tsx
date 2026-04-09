'use client'

import { useState } from 'react'
import { Student } from '../types/student'
import { IconButton } from './IconButton'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  students: Student[]
  loading?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => Promise<void>
  deletingId?: string | null
  error?: string | null
}

type PendingAction = { type: 'delete'; student: Student }

export function StudentList({
  students,
  loading,
  onEdit,
  onDelete,
  deletingId,
  error,
}: Props) {
  const [pending, setPending] = useState<PendingAction | null>(null)

  if (loading) {
    return <p className="muted" style={{ fontSize: 13 }}>Carregando alunos…</p>
  }

  const handleConfirm = async () => {
    if (!pending) return
    if (pending.type === 'delete' && onDelete) {
      try {
        await onDelete(pending.student.id)
      } catch (err) {
        console.error('Falha ao excluir aluno', err)
      }
    }
    setPending(null)
  }

  return (
    <>
      {pending ? (
        <ConfirmDialog
          variant="danger"
          title="Excluir aluno"
          message={`Tem certeza que deseja excluir "${pending.student.name}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      ) : null}

      <div className="list">
        {error ? <div className="error-text">{error}</div> : null}

        {!students.length ? (
          <p className="muted" style={{ fontSize: 13 }}>Nenhum aluno cadastrado.</p>
        ) : null}

        {students.map(student => (
          <div className="list-item" key={student.id}>
            <div className="list-item-row">
              <div style={{ minWidth: 0 }}>
                <h4>{student.name}</h4>
                <p>{student.address}</p>
                <p className="coords">
                  {student.latitude.toFixed(4)}, {student.longitude.toFixed(4)}
                </p>
              </div>
              <div className="actions-row">
                {onEdit ? (
                  <IconButton
                    label={`Editar ${student.name}`}
                    onClick={() => onEdit(student.id)}
                  >
                    ✎
                  </IconButton>
                ) : null}
                {onDelete ? (
                  <IconButton
                    variant="danger"
                    label={`Excluir ${student.name}`}
                    onClick={() => setPending({ type: 'delete', student })}
                    loading={deletingId === student.id}
                  >
                    ✕
                  </IconButton>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
