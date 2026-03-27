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

export interface UpdateStudentPayload {
  name?: string
  address?: string
  latitude?: number
  longitude?: number
  universityId?: string
}

export async function updateStudent(
  id: string,
  payload: UpdateStudentPayload
): Promise<Student> {
  const { data } = await api.patch<Student>(`/students/${id}`, payload)
  return data
}
