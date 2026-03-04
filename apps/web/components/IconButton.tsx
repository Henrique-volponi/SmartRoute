import { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: 'default' | 'danger'
  loading?: boolean
  children: ReactNode
}

export function IconButton({
  label,
  variant = 'default',
  loading = false,
  children,
  disabled,
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || loading
  return (
    <button
      type="button"
      className={`icon-button${variant === 'danger' ? ' danger' : ''}`}
      aria-label={label}
      title={label}
      disabled={isDisabled}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  )
}
