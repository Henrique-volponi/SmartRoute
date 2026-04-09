import { RouteKind } from '../types/route'

interface Props {
  onGenerate: (type: RouteKind) => void
  loading: boolean
  error?: string | null
}

export function ActionButtons({ onGenerate, loading, error }: Props) {
  return (
    <div>
      <div className="actions">
        <button className="button" onClick={() => onGenerate('IDA')} disabled={loading}>
          {loading ? 'Gerando…' : 'Gerar Rota de Ida ao Campus'}
        </button>
        <button
          className="button secondary"
          onClick={() => onGenerate('VOLTA')}
          disabled={loading}
        >
          {loading ? 'Gerando…' : 'Gerar Rota da Volta do Campus'}
        </button>
      </div>
      {error ? <div className="error-text" style={{ marginTop: 10 }}>{error}</div> : null}
    </div>
  )
}
