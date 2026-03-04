import axios from 'axios'
import { Injectable } from '@nestjs/common'

export interface OptimizedRouteResult {
  optimizedOrder: number[]
  totalDistance: number
  totalDuration: number
  geometry: unknown
}

@Injectable()
export class OptimizationService {
  async optimizeTrip(coordinates: Array<[number, number]>) {
    if (coordinates.length < 2) {
      throw new Error('Ao menos dois pontos são necessários para otimização.')
    }

    const coordsParam = coordinates.map(([lon, lat]) => `${lon},${lat}`).join(';')
    const url =
      `http://router.project-osrm.org/trip/v1/driving/${coordsParam}` +
      '?source=first&roundtrip=false&overview=full&geometries=geojson'

    const { data } = await axios.get(url)

    if (data?.code !== 'Ok' || !data.trips?.length) {
      throw new Error('Não foi possível otimizar a rota via OSRM.')
    }

    const trip = data.trips[0]

    const optimizedOrder = trip.waypoints?.map((wp: any) => wp.waypoint_index) ?? []

    const result: OptimizedRouteResult = {
      optimizedOrder,
      totalDistance: trip.distance,
      totalDuration: trip.duration,
      geometry: trip.geometry,
    }

    return result
  }
}
