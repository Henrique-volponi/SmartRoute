import { api } from './api'
import { University } from '../types/student'

export interface CreateUniversityPayload {
  name: string
  latitude: number
  longitude: number
}

export async function fetchUniversities(): Promise<University[]> {
  const { data } = await api.get<University[]>('/universities')
  return data
}

export async function createUniversity(payload: CreateUniversityPayload): Promise<University> {
  const { data } = await api.post<University>('/universities', payload)
  return data
}

export async function deleteUniversity(id: string): Promise<void> {
  await api.delete(`/universities/${id}`)
}
