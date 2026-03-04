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

    const osrmBaseUrl = process.env.OSRM_BASE_URL || 'https://router.project-osrm.org'
    const url = `${osrmBaseUrl}/trip/v1/driving/${coordsParam}?${params.toString()}`

    let data: any
    try {
      const response = await axios.get(url, { timeout: 10_000 })
      data = response.data
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('A requisição ao serviço OSRM excedeu o tempo limite.')
        }
        throw new Error('Não foi possível se comunicar com o serviço OSRM.')
      }
      throw error
    }

    if (data?.code !== 'Ok' || !data.trips?.length) {
      throw new Error('Não foi possível otimizar a rota via OSRM.')
    }

    const trip = data.trips[0]

    const waypoints = Array.isArray(data.waypoints)
      ? data.waypoints
      : Array.isArray(trip?.waypoints)
        ? trip.waypoints
        : []

    const waypointPairs = waypoints.map((wp: any, inputIndex: number) => ({
      inputIndex,
      waypointIndex: wp?.waypoint_index as number | undefined,
    }))

    const optimizedOrder =
      waypointPairs.length > 0
        ? waypointPairs
            .filter((item): item is { inputIndex: number; waypointIndex: number } =>
              Number.isInteger(item.waypointIndex)
            )
            .sort((a, b) => a.waypointIndex - b.waypointIndex)
            .map(item => item.inputIndex)
        : []

    const result: OptimizedRouteResult = {
      optimizedOrder,
      totalDistance: trip.distance,
      totalDuration: trip.duration,
      geometry: trip.geometry,
    }

    return result
  }
}
