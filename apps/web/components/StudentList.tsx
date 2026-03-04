import { Student } from '../types/student'

interface Props {
  students: Student[]
  loading?: boolean
}

export function StudentList({ students, loading }: Props) {
  if (loading) {
    return <p className="muted">Carregando alunos…</p>
  }

  if (!students.length) {
    return <p className="muted">Nenhum aluno cadastrado.</p>
  }

  return (
    <div className="list">
      {students.map(student => (
        <div className="list-item" key={student.id}>
          <h4>{student.name}</h4>
          <p>{student.address}</p>
          <p className="muted">
            {student.latitude.toFixed(4)}, {student.longitude.toFixed(4)}
          </p>
        </div>
      ))}
    </div>
  )
}
