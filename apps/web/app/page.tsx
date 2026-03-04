'use client'

import { Sidebar } from '../components/Sidebar'
import { MapView } from '../components/MapView'
import { useRoutePlanner } from '../hooks/useRoutePlanner'
import { RouteKind } from '../types/route'

export default function HomePage() {
  const { students, studentsLoading, route, routeLoading, orderedStops, requestRoute } =
    useRoutePlanner()

  const handleGenerate = (type: RouteKind) => {
    requestRoute(type)
  }

  return (
    <div className="layout">
      <Sidebar
        students={students}
        studentsLoading={studentsLoading}
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
