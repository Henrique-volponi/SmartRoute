import { api } from './api'
import { RouteKind, RouteResponse } from '../types/route'

export async function generateRoute(type: RouteKind): Promise<RouteResponse> {
  const { data } = await api.post<RouteResponse>('/routes/generate', { type })
  return data
}
