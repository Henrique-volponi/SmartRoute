'use client'

import { Sidebar } from '../components/Sidebar'
import { MapView } from '../components/MapView'
import { useRoutePlanner } from '../hooks/useRoutePlanner'
import { useUniversities } from '../hooks/useUniversities'
import { RouteKind } from '../types/route'

export default function HomePage() {
  const {
    students,
    studentsLoading,
    route,
    routeGeneratedAt,
    routeLoading,
    routeError,
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

  const {
    universities,
    loading: universitiesLoading,
    saving: universitySaving,
    deletingId: universityDeletingId,
    error: universityError,
    add: addUniversity,
    remove: removeUniversity,
  } = useUniversities()

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
        universities={universities}
        universitiesLoading={universitiesLoading}
        universitySaving={universitySaving}
        universityDeletingId={universityDeletingId}
        universityError={universityError}
        onAddUniversity={addUniversity}
        onDeleteUniversity={removeUniversity}
        route={route}
        routeGeneratedAt={routeGeneratedAt}
        orderedStops={orderedStops}
        onGenerate={(type: RouteKind) => requestRoute(type)}
        routeLoading={routeLoading}
        routeError={routeError}
      />

      <main className="content">
        <MapView geometry={route?.geometry ?? null} stops={orderedStops} />
      </main>
    </div>
  )
}
