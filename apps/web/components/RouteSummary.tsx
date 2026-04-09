import { RouteResponse, StopPoint } from '../types/route'
import { getTrafficInfo, estimateFuel, formatDuration } from '../utils/traffic'

function formatDistance(meters?: number) {
  if (meters == null) return '—'
  return `${(meters / 1000).toFixed(2)} km`
}

function formatDurationSeconds(seconds?: number) {
  if (seconds == null) return '—'
  return formatDuration(seconds)
}

interface Props {
  route?: RouteResponse
  orderedStops: StopPoint[]
  generatedAt?: Date
}

export function RouteSummary({ route, orderedStops, generatedAt }: Props) {
  const hasStops = orderedStops.length > 0

  const traffic = generatedAt ? getTrafficInfo(generatedAt.getHours()) : null
  const adjustedDuration =
    traffic && route ? route.totalDuration * traffic.multiplier : null
  const fuel =
    traffic && route ? estimateFuel(route.totalDistance, traffic.multiplier) : null

  const extraMinutes =
    adjustedDuration && route
      ? Math.round((adjustedDuration - route.totalDuration) / 60)
      : 0

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
          <div className="summary-stat-label">
            {traffic ? 'Duração base' : 'Duração'}
          </div>
          <div className={`summary-stat-value${route ? ' accent' : ''}`}>
            {formatDurationSeconds(route?.totalDuration)}
          </div>
        </div>
      </div>

      {traffic && route ? (
        <div className={`traffic-banner traffic-${traffic.severity}`}>
          <div className="traffic-banner-top">
            <span className="traffic-label">
              {traffic.icon} {traffic.label}
            </span>
            <span className="traffic-time">
              {generatedAt?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="traffic-stats">
            <div className="traffic-stat">
              <span className="traffic-stat-label">Com trânsito</span>
              <span className="traffic-stat-value">
                {formatDuration(adjustedDuration!)}
                {extraMinutes > 0 ? (
                  <span className="traffic-extra">+{extraMinutes} min</span>
                ) : null}
              </span>
            </div>
            <div className="traffic-stat">
              <span className="traffic-stat-label">Combustível est.</span>
              <span className="traffic-stat-value">{fuel!.liters.toFixed(1)} L</span>
            </div>
          </div>
        </div>
      ) : null}

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
