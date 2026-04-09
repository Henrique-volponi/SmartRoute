'use client'

import { FormEvent, useState } from 'react'
import { CreateUniversityPayload } from '../services/universities'
import { geocodeAddress } from '../services/geocoding'

interface Props {
  loading: boolean
  onSubmit: (payload: CreateUniversityPayload) => Promise<void>
  onCancel: () => void
}

const initialState = { name: '', latitude: '', longitude: '' }

export function UniversityForm({ loading, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState(initialState)
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const [geocoded, setGeocoded] = useState(false)

  const update = (key: keyof typeof initialState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (key === 'name') setGeocoded(false)
    if (key === 'latitude' || key === 'longitude') setGeocoded(false)
  }

  const handleGeocode = async () => {
    const name = form.name.trim()
    if (!name) return

    setGeocoding(true)
    setGeocoded(false)
    setError(null)

    try {
      const result = await geocodeAddress(name)
      if (!result) {
        setError('Universidade não encontrada. Tente incluir a cidade (ex: "UFMG Belo Horizonte") ou preencha as coordenadas manualmente.')
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setFieldError(null)

    const name = form.name.trim()
    const latitude = Number(form.latitude)
    const longitude = Number(form.longitude)

    if (!name) {
      setFieldError('Nome é obrigatório.')
      return
    }
    if (Number.isNaN(latitude) || Number.isNaN(longitude) || !form.latitude || !form.longitude) {
      setError('Preencha as coordenadas ou use a busca automática.')
      return
    }

    try {
      await onSubmit({ name, latitude, longitude })
      setForm(initialState)
      setGeocoded(false)
    } catch (err) {
      console.error('Erro ao salvar universidade', err)
      setError('Não foi possível salvar a universidade. Tente novamente.')
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <div className="form-grid">
        <div className="field" style={{ gridColumn: '1 / -1' }}>
          <span className="field-label">Nome</span>
          <div className="geocode-row">
            <input
              className="input"
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="UFMG, PUC Minas…"
              required
            />
            <button
              type="button"
              className="geocode-btn"
              onClick={handleGeocode}
              disabled={geocoding || !form.name.trim()}
              title="Buscar coordenadas pelo nome"
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
          {fieldError ? <span className="error-text">{fieldError}</span> : null}
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
            onChange={e => update('latitude', e.target.value)}
            placeholder="-19.8716"
            required
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
            onChange={e => update('longitude', e.target.value)}
            placeholder="-43.9671"
            required
          />
        </label>
      </div>

      {error ? <div className="error-text" style={{ marginTop: 10 }}>{error}</div> : null}

      <div className="form-actions">
        <button className="button secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancelar
        </button>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Salvando…' : 'Cadastrar'}
        </button>
      </div>
    </form>
  )
}
