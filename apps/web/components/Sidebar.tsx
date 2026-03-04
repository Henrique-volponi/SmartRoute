import { ActionButtons } from './ActionButtons'
import { StudentList } from './StudentList'
import { RouteSummary } from './RouteSummary'
import { RouteKind, RouteResponse, StopPoint } from '../types/route'
import { Student } from '../types/student'

interface Props {
  students: Student[]
  studentsLoading: boolean
  route?: RouteResponse
  orderedStops: StopPoint[]
  onGenerate: (type: RouteKind) => void
  routeLoading: boolean
}

export function Sidebar({
  students,
  studentsLoading,
  route,
  orderedStops,
  onGenerate,
  routeLoading,
}: Props) {
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
        <div className="section-title">Alunos</div>
        <StudentList students={students} loading={studentsLoading} />
      </div>
    </aside>
  )
}
