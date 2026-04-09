'use client'

import { useState } from 'react'
import { University } from '../types/student'
import { IconButton } from './IconButton'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  universities: University[]
  loading?: boolean
  onDelete?: (id: string) => Promise<void>
  deletingId?: string | null
  error?: string | null
}

export function UniversityList({ universities, loading, onDelete, deletingId, error }: Props) {
  const [pendingDelete, setPendingDelete] = useState<University | null>(null)

  if (loading) {
    return <p className="muted" style={{ fontSize: 13 }}>Carregando universidades…</p>
  }

  const handleConfirm = async () => {
    if (!pendingDelete || !onDelete) return
    try {
      await onDelete(pendingDelete.id)
    } catch {
      // error handled by hook
    }
    setPendingDelete(null)
  }

  return (
    <>
      {pendingDelete ? (
        <ConfirmDialog
          variant="danger"
          title="Excluir universidade"
          message={`Tem certeza que deseja excluir "${pendingDelete.name}"? Alunos vinculados não poderão gerar rotas.`}
          confirmLabel="Excluir"
          onConfirm={handleConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}

      <div className="list">
        {error ? <div className="error-text">{error}</div> : null}

        {!universities.length ? (
          <p className="muted" style={{ fontSize: 13 }}>Nenhuma universidade cadastrada.</p>
        ) : null}

        {universities.map(uni => (
          <div className="list-item" key={uni.id}>
            <div className="list-item-row">
              <div style={{ minWidth: 0 }}>
                <h4>{uni.name}</h4>
                <p className="coords">
                  {uni.latitude.toFixed(4)}, {uni.longitude.toFixed(4)}
                </p>
              </div>
              {onDelete ? (
                <div className="actions-row">
                  <IconButton
                    variant="danger"
                    label={`Excluir ${uni.name}`}
                    onClick={() => setPendingDelete(uni)}
                    loading={deletingId === uni.id}
                  >
                    ✕
                  </IconButton>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
