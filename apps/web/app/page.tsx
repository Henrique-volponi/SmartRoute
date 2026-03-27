'use client'

import { Sidebar } from '../components/Sidebar'
import { MapView } from '../components/MapView'
import { useRoutePlanner } from '../hooks/useRoutePlanner'
import { RouteKind } from '../types/route'

export default function HomePage() {
  const {
    students,
    studentsLoading,
    route,
    routeLoading,
    orderedStops,
    requestRoute,
    addStudent,
    editStudent,
    editingStudentId,
    setEditingStudentId,
    studentSaving,
    removeStudent,
    studentDeletingId,
    studentError,
  } = useRoutePlanner()

  const handleGenerate = (type: RouteKind) => {
    requestRoute(type)
  }

  return (
    <div className="layout">
      <Sidebar
        students={students}
        studentsLoading={studentsLoading}
        onAddStudent={addStudent}
        onEditStudent={editStudent}
        editingStudentId={editingStudentId}
        setEditingStudentId={setEditingStudentId}
        studentSaving={studentSaving}
        onDeleteStudent={removeStudent}
        studentDeletingId={studentDeletingId}
        studentError={studentError}
        route={route}
        orderedStops={orderedStops}
        onGenerate={handleGenerate}
        routeLoading={routeLoading}
      />

      <main className="content">
        <MapView geometry={route?.geometry ?? null} stops={orderedStops} />
      </main>
    </div>
  )
}
