import { Student } from '../types/student'
import { IconButton } from './IconButton'

interface Props {
  students: Student[]
  loading?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => Promise<void>
  deletingId?: string | null
  error?: string | null
}

export function StudentList({
  students,
  loading,
  onEdit,
  onDelete,
  deletingId,
  error,
}: Props) {
  if (loading) {
    return <p className="muted">Carregando alunos…</p>
  }

  return (
    <div className="list">
      {error ? <div className="error-text">{error}</div> : null}

      {!students.length ? <p className="muted">Nenhum aluno cadastrado.</p> : null}

      {students.map(student => (
        <div className="list-item" key={student.id}>
          <div className="list-item-row">
            <div>
              <h4>{student.name}</h4>
              <p>{student.address}</p>
              <p className="muted">
                {student.latitude.toFixed(4)}, {student.longitude.toFixed(4)}
              </p>
            </div>
            <div className="actions">
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
                  onClick={async () => {
                    try {
                      await onDelete(student.id)
                    } catch (err) {
                      console.error('Falha ao excluir aluno', err)
                    }
                  }}
                  loading={deletingId === student.id}
                >
                  X
                </IconButton>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
