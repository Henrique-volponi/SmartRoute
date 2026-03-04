import { RouteKind } from '../types/route'

interface Props {
  onGenerate: (type: RouteKind) => void
  loading: boolean
}

export function ActionButtons({ onGenerate, loading }: Props) {
  return (
    <div className="actions">
      <button className="button" onClick={() => onGenerate('IDA')} disabled={loading}>
        {loading ? 'Gerando…' : 'Gerar Rota de Ida'}
      </button>
      <button
        className="button secondary"
        onClick={() => onGenerate('VOLTA')}
        disabled={loading}
      >
        {loading ? 'Gerando…' : 'Gerar Rota da Volta'}
      </button>
    </div>
  )
}
