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

const LABELS = {
  distance: 'Distância',
  duration: 'Duração',
  stops: 'Paradas',
  type: 'Tipo',
  noStops: 'Gere uma rota para ver a ordem.',
}

function DistanceBlock({ distance }: { distance?: number }) {
  return (
    <div>
      <strong style={{ marginBottom: 4 }}>{LABELS.distance}</strong>
      <span>{formatDistance(distance)}</span>
    </div>
  )
}

function DurationBlock({ duration }: { duration?: number }) {
  return (
    <div>
      <strong style={{ marginBottom: 4 }}>{LABELS.duration}</strong>
      <span>{formatDuration(duration)}</span>
    </div>
  )
}

function StopsBlock({ orderedStops }: { orderedStops: StopPoint[] }) {
  const hasStops = orderedStops.length > 0
  return (
    <div>
      <strong style={{ marginBottom: 4 }}>{LABELS.stops}</strong>
      <div className="order-list">
        {hasStops ? (
          orderedStops.map(stop => (
            <span className="order-pill" key={`${stop.label}-${stop.order ?? stop.lat}`}>
              {stop.order ?? '•'} — {stop.label}
            </span>
          ))
        ) : (
          <span className="muted">{LABELS.noStops}</span>
        )}
      </div>
    </div>
  )
}

function TypeBlock({ type }: { type?: string }) {
  return (
    <div>
      <strong style={{ marginBottom: 4 }}>{LABELS.type}</strong>
      <span>{type ?? '—'}</span>
    </div>
  )
}

interface Props {
  route?: RouteResponse
  orderedStops: StopPoint[]
}

export function RouteSummary({ route, orderedStops }: Props) {
  return (
    <div className="summary-card">
      <DistanceBlock distance={route?.totalDistance} />
      <DurationBlock duration={route?.totalDuration} />
      <StopsBlock orderedStops={orderedStops} />
      <TypeBlock type={route?.type} />
    </div>
  )
}
