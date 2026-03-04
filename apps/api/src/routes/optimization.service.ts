import axios from 'axios'
import { Injectable } from '@nestjs/common'

export interface OptimizedRouteResult {
  optimizedOrder: number[]
  totalDistance: number
  totalDuration: number
  geometry: unknown
}

interface OptimizeOptions {
  source?: 'any' | 'first' | 'last'
  destination?: 'any' | 'first' | 'last'
}

@Injectable()
export class OptimizationService {
  async optimizeTrip(
    coordinates: Array<[number, number]>,
    options: OptimizeOptions = {}
  ) {
    if (coordinates.length < 2) {
      throw new Error('Ao menos dois pontos são necessários para otimização.')
    }

    const coordsParam = coordinates.map(([lon, lat]) => `${lon},${lat}`).join(';')
    const params = new URLSearchParams({
      roundtrip: 'false',
      overview: 'full',
      geometries: 'geojson',
    })

    if (options.source) params.set('source', options.source)
    if (options.destination) params.set('destination', options.destination)

    const url = `http://router.project-osrm.org/trip/v1/driving/${coordsParam}?${params.toString()}`

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
