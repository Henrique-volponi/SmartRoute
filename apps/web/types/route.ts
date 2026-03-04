export type RouteKind = 'IDA' | 'VOLTA'

export interface RouteResponse {
  routeId: string
  type: RouteKind
  totalDistance: number
  totalDuration: number
  optimizedOrder: number[]
  geometry: GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Geometry
}

export interface StopPoint {
  label: string
  lat: number
  lng: number
  order?: number
  kind: 'university' | 'student'
}
