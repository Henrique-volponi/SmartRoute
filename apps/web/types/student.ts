export interface University {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface Student {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  university?: University
  universityId: string
}
