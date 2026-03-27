'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CreateStudentPayload } from '../services/students'
import { Student, University } from '../types/student'

interface Props {
  universities: University[]
  loading: boolean
  onSubmit: (payload: CreateStudentPayload) => Promise<void>
  onCancel: () => void
  initialData?: Student | null
}

const initialState = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  universityId: '',
}

type FormState = typeof initialState

export function StudentForm({
  universities,
  loading,
  onSubmit,
  onCancel,
  initialData,
}: Props) {
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; address?: string }>({})
  const isEditing = !!initialData

  const firstUniversityId = useMemo(() => universities[0]?.id ?? '', [universities])

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        address: initialData.address,
        latitude: initialData.latitude.toString(),
        longitude: initialData.longitude.toString(),
        universityId: initialData.universityId,
      })
    } else {
      setForm(initialState)
    }
  }, [initialData])

  useEffect(() => {
    if (!form.universityId && firstUniversityId) {
      setForm(prev => ({ ...prev, universityId: firstUniversityId }))
    }
  }, [firstUniversityId, form.universityId])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)
    const trimmedName = form.name.trim()
    const trimmedAddress = form.address.trim()

    const errors: { name?: string; address?: string } = {}
    if (!trimmedName) {
      errors.name = 'Nome é obrigatório.'
    }
    if (!trimmedAddress) {
      errors.address = 'Endereço é obrigatório.'
    }

    if (errors.name || errors.address) {
      setFieldErrors(errors)
      return
    }

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setError('Latitude e longitude precisam ser números válidos.')
      return
    }

    const payload: CreateStudentPayload = {
      name: trimmedName,
      address: trimmedAddress,
      latitude,
      longitude,
      universityId: form.universityId || firstUniversityId,
    }

    try {
      await onSubmit(payload)
      setForm(initialState)
    } catch (err) {
      console.error('Erro ao criar aluno', err)
      setError('Não foi possível salvar o aluno. Tente novamente.')
    }
  }

  const updateField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span className="field-label">Nome</span>
          <input
            className="input"
            type="text"
            value={form.name}
            onChange={e => updateField('name', e.target.value)}
            required
            placeholder="Maria Silva"
          />
          {fieldErrors.name ? (
            <span className="error-text">{fieldErrors.name}</span>
          ) : null}
        </label>
        <label className="field">
          <span className="field-label">Endereço</span>
          <input
            className="input"
            type="text"
            value={form.address}
            onChange={e => updateField('address', e.target.value)}
            required
            placeholder="Rua Exemplo, 123"
          />
          {fieldErrors.address ? (
            <span className="error-text">{fieldErrors.address}</span>
          ) : null}
        </label>
        <label className="field">
          <span className="field-label">Latitude</span>
          <input
            className="input"
            type="number"
            step="any"
            value={form.latitude}
            onChange={e => updateField('latitude', e.target.value)}
            required
            placeholder="-23.5614"
          />
        </label>
        <label className="field">
          <span className="field-label">Longitude</span>
          <input
            className="input"
            type="number"
            step="any"
            value={form.longitude}
            onChange={e => updateField('longitude', e.target.value)}
            required
            placeholder="-46.6558"
          />
        </label>
        <label className="field">
          <span className="field-label">Universidade</span>
          <select
            className="input"
            value={form.universityId || firstUniversityId}
            onChange={e => updateField('universityId', e.target.value)}
            required
            disabled={!universities.length}
          >
            {universities.map(university => (
              <option key={university.id} value={university.id}>
                {university.name}
              </option>
            ))}
          </select>
          {!universities.length ? (
            <span className="helper">Cadastre uma universidade primeiro.</span>
          ) : null}
        </label>
      </div>

      {error ? <div className="error-text">{error}</div> : null}

      <div className="form-actions">
        <button
          className="button secondary"
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          className="button"
          type="submit"
          disabled={loading || !universities.length}
        >
          {loading ? 'Salvando…' : isEditing ? 'Atualizar aluno' : 'Cadastrar aluno'}
        </button>
      </div>
    </form>
  )
}
