import { api } from './api'
import { Student } from '../types/student'

export async function fetchStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>('/students')
  return data
}
