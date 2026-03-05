import { api } from './api'
import { University } from '../types/student'

export async function fetchUniversities(): Promise<University[]> {
  const { data } = await api.get<University[]>('/universities')
  return data
}
