export type TrafficSeverity = 'low' | 'medium' | 'high'

export interface TrafficInfo {
  label: string
  multiplier: number
  severity: TrafficSeverity
  icon: string
}

export interface FuelEstimate {
  liters: number
  fuelMultiplier: number
}

/** Returns traffic info based on hour of day (0-23). */
export function getTrafficInfo(hour: number): TrafficInfo {
  if (hour >= 7 && hour < 9)   return { label: 'Pico da manhã',     multiplier: 1.7,  severity: 'high',   icon: '🔴' }
  if (hour >= 17 && hour < 20) return { label: 'Pico da tarde',     multiplier: 1.65, severity: 'high',   icon: '🔴' }
  if (hour >= 12 && hour < 14) return { label: 'Horário de almoço', multiplier: 1.3,  severity: 'medium', icon: '🟡' }
  if (hour >= 9  && hour < 12) return { label: 'Manhã tranquila',   multiplier: 1.2,  severity: 'medium', icon: '🟡' }
  if (hour >= 14 && hour < 17) return { label: 'Tarde tranquila',   multiplier: 1.15, severity: 'medium', icon: '🟡' }
  if (hour >= 20 && hour < 23) return { label: 'Noite',             multiplier: 1.05, severity: 'low',    icon: '🟢' }
  return                               { label: 'Madrugada',         multiplier: 1.0,  severity: 'low',    icon: '🟢' }
}

/**
 * Estimates fuel consumption for a van.
 * Base: 12 L/100km. Stop-and-go traffic increases consumption proportionally
 * to how much extra time it adds (roughly 60% of the time penalty translates to fuel).
 */
export function estimateFuel(distanceMeters: number, trafficMultiplier: number): FuelEstimate {
  const distanceKm = distanceMeters / 1000
  const baseFuelPer100km = 12
  const fuelMultiplier = 1 + (trafficMultiplier - 1) * 0.6
  const liters = (distanceKm / 100) * baseFuelPer100km * fuelMultiplier
  return { liters, fuelMultiplier }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hrs}h ${mins}min` : `${hrs}h`
}
