import { RouteResponse, StopPoint } from '../types/route'

function formatDistance(meters?: number) {
  if (meters == null) return '—'
  return `${(meters / 1000).toFixed(2)} km`
}

function formatDuration(seconds?: number) {
  if (seconds == null) return '—'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}h ${mins}min`
}

interface Props {
  route?: RouteResponse
  orderedStops: StopPoint[]
}

export function RouteSummary({ route, orderedStops }: Props) {
  const hasStops = orderedStops.length > 0

  return (
    <div className="summary-card">
      <div>
        <strong>Distância</strong>
        <span>{formatDistance(route?.totalDistance)}</span>
      </div>
      <div>
        <strong>Duração</strong>
        <span>{formatDuration(route?.totalDuration)}</span>
      </div>
      <div>
        <strong>Paradas</strong>
        <div className="order-list">
          {hasStops ? (
            orderedStops.map(stop => (
              <span
                className="order-pill"
                key={`${stop.label}-${stop.order ?? stop.lat}`}
              >
                {stop.order ?? '•'} — {stop.label}
              </span>
            ))
          ) : (
            <span className="muted">Gere uma rota para ver a ordem.</span>
          )}
        </div>
      </div>
      <div>
        <strong>Tipo</strong>
        <span>{route?.type ?? '—'}</span>
      </div>
    </div>
  )
}
