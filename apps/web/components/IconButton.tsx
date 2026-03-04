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
  className,
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || loading
  const mergedClassName = `icon-button${variant === 'danger' ? ' danger' : ''}${className ? ` ${className}` : ''}`
  return (
    <button
      {...props}
      type="button"
      className={mergedClassName}
      aria-label={label}
      title={label}
      disabled={isDisabled}
    >
      {loading ? '...' : children}
    </button>
  )
}
