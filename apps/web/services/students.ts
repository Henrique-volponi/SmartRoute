import { api } from './api'
import { Student } from '../types/student'

export async function fetchStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>('/students')
  return data
}

export interface CreateStudentPayload {
  name: string
  address: string
  latitude: number
  longitude: number
  universityId: string
}

export async function createStudent(payload: CreateStudentPayload): Promise<Student> {
  const { data } = await api.post<Student>('/students', payload)
  return data
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`)
}
