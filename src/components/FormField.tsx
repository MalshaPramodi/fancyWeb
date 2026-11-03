import type { ReactNode } from 'react'

type InputAccessibility = {
  id: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
}
export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: (props: InputAccessibility) => ReactNode
}) {
  const description =
    [hint ? `${id}-hint` : '', error ? `${id}-error` : '']
      .filter(Boolean)
      .join(' ') || undefined
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-ink">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': !!error,
        'aria-describedby': description,
      })}
      {hint && (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs leading-relaxed text-burgundy">
          {error}
        </p>
      )}
    </div>
  )
}
