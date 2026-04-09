'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CreateStudentPayload } from '../services/students'
import { Student, University } from '../types/student'
import { ConfirmDialog } from './ConfirmDialog'
import { geocodeAddress } from '../services/geocoding'

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
  const [pendingPayload, setPendingPayload] = useState<CreateStudentPayload | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const [geocoded, setGeocoded] = useState(false)
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
    setGeocoded(false)
  }, [initialData])

  useEffect(() => {
    if (!form.universityId && firstUniversityId) {
      setForm(prev => ({ ...prev, universityId: firstUniversityId }))
    }
  }, [firstUniversityId, form.universityId])

  const handleGeocode = async () => {
    const address = form.address.trim()
    if (!address) return

    setGeocoding(true)
    setGeocoded(false)
    setError(null)

    try {
      const result = await geocodeAddress(address)
      if (!result) {
        setError('Endereço não encontrado. Tente ser mais específico ou preencha as coordenadas manualmente.')
        return
      }
      setForm(prev => ({
        ...prev,
        latitude: result.lat.toFixed(6),
        longitude: result.lng.toFixed(6),
      }))
      setGeocoded(true)
    } catch {
      setError('Não foi possível buscar as coordenadas. Verifique sua conexão.')
    } finally {
      setGeocoding(false)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)
    const trimmedName = form.name.trim()
    const trimmedAddress = form.address.trim()

    const errors: { name?: string; address?: string } = {}
    if (!trimmedName) errors.name = 'Nome é obrigatório.'
    if (!trimmedAddress) errors.address = 'Endereço é obrigatório.'

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

    if (isEditing) {
      setPendingPayload(payload)
      return
    }

    await submitPayload(payload)
  }

  const submitPayload = async (payload: CreateStudentPayload) => {
    try {
      await onSubmit(payload)
      setForm(initialState)
      setGeocoded(false)
    } catch (err) {
      console.error('Erro ao salvar aluno', err)
      setError('Não foi possível salvar o aluno. Tente novamente.')
    }
  }

  const updateField = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (key === 'address') setGeocoded(false)
  }

  return (
    <>
      {pendingPayload ? (
        <ConfirmDialog
          variant="default"
          title="Atualizar aluno"
          message={`Tem certeza que deseja salvar as alterações de "${initialData?.name}"?`}
          confirmLabel="Atualizar"
          onConfirm={async () => {
            setPendingPayload(null)
            await submitPayload(pendingPayload)
          }}
          onCancel={() => setPendingPayload(null)}
        />
      ) : null}

      <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
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

          <div className="field">
            <span className="field-label">Endereço</span>
            <div className="geocode-row">
              <input
                className="input"
                type="text"
                value={form.address}
                onChange={e => updateField('address', e.target.value)}
                required
                placeholder="Rua Exemplo, 123, Belo Horizonte"
              />
              <button
                type="button"
                className="geocode-btn"
                onClick={handleGeocode}
                disabled={geocoding || !form.address.trim()}
                title="Buscar coordenadas pelo endereço"
              >
                {geocoding ? (
                  <span className="geocode-spinner" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.address ? (
              <span className="error-text">{fieldErrors.address}</span>
            ) : null}
          </div>

          <label className="field">
            <span className="field-label">
              Latitude
              {geocoded ? <span className="geocode-tag">auto</span> : null}
            </span>
            <input
              className={`input${geocoded ? ' input-geocoded' : ''}`}
              type="number"
              step="any"
              value={form.latitude}
              onChange={e => { updateField('latitude', e.target.value); setGeocoded(false) }}
              required
              placeholder="-19.8716"
            />
          </label>

          <label className="field">
            <span className="field-label">
              Longitude
              {geocoded ? <span className="geocode-tag">auto</span> : null}
            </span>
            <input
              className={`input${geocoded ? ' input-geocoded' : ''}`}
              type="number"
              step="any"
              value={form.longitude}
              onChange={e => { updateField('longitude', e.target.value); setGeocoded(false) }}
              required
              placeholder="-43.9671"
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

        {error ? <div className="error-text" style={{ marginTop: 10 }}>{error}</div> : null}

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
    </>
  )
}
