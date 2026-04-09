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
      <div className="summary-stats">
        <div className="summary-stat">
          <div className="summary-stat-label">Distância</div>
          <div className={`summary-stat-value${route ? ' accent' : ''}`}>
            {formatDistance(route?.totalDistance)}
          </div>
        </div>
        <div className="summary-stat">
          <div className="summary-stat-label">Duração</div>
          <div className={`summary-stat-value${route ? ' accent' : ''}`}>
            {formatDuration(route?.totalDuration)}
          </div>
        </div>
      </div>

      <div className="summary-stops">
        <div className="summary-stat-label" style={{ marginBottom: 8 }}>Paradas</div>
        <div className="order-list">
          {hasStops ? (
            orderedStops.map(stop => (
              <span
                className="order-pill"
                key={`${stop.label}-${stop.order ?? stop.lat}`}
                title={stop.label}
              >
                <span className="order-pill-num">{stop.order ?? '•'}</span>
                {stop.label}
              </span>
            ))
          ) : (
            <span className="muted" style={{ fontSize: 12 }}>
              Gere uma rota para ver a ordem.
            </span>
          )}
        </div>
      </div>

      <div className="summary-type">
        <span className="summary-type-label">Tipo</span>
        <span className="summary-type-value">{route?.type ?? '—'}</span>
      </div>
    </div>
  )
}
