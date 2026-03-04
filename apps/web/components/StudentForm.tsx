'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CreateStudentPayload } from '../services/students'
import { University } from '../types/student'

interface Props {
  universities: University[]
  loading: boolean
  onSubmit: (payload: CreateStudentPayload) => Promise<void>
  onCancel: () => void
}

const initialState = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  universityId: '',
}

type FormState = typeof initialState

export function StudentForm({ universities, loading, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)

  const firstUniversityId = useMemo(() => universities[0]?.id ?? '', [universities])

  useEffect(() => {
    if (!form.universityId && firstUniversityId) {
      setForm(prev => ({ ...prev, universityId: firstUniversityId }))
    }
  }, [firstUniversityId, form.universityId])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setError('Latitude e longitude precisam ser números válidos.')
      return
    }

    const payload: CreateStudentPayload = {
      name: form.name.trim(),
      address: form.address.trim(),
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
          {loading ? 'Salvando…' : 'Cadastrar aluno'}
        </button>
      </div>
    </form>
  )
}
