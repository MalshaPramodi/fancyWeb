import { useState } from 'react'
import { paymentConfig } from '../config/payment'
import { formatLkr } from '../lib/format'
import { LineIcon } from './LineIcon'

export function BankDetails({ total }: { total: number }) {
  const [copied, setCopied] = useState('')
  const [message, setMessage] = useState('')
  const copy = async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(id)
      setMessage(paymentConfig.copy.copied)
    } catch {
      setCopied('')
      setMessage(paymentConfig.copy.copyError)
    }
  }
  return (
    <section aria-label={paymentConfig.copy.bankTitle} className="space-y-6">
      <p className="rounded-button bg-gold-soft/50 px-4 py-3 text-xs leading-relaxed text-gold-dark">
        {paymentConfig.copy.previewNotice}
      </p>
      <div className="border-b border-line pb-6">
        <p className="text-xs uppercase tracking-widest text-muted">
          {paymentConfig.copy.amount}
        </p>
        <p className="mt-2 font-display text-4xl text-evergreen">
          {formatLkr(total)}
        </p>
      </div>
      <h3 className="font-display text-3xl">{paymentConfig.copy.bankTitle}</h3>
      <dl className="space-y-5">
        {paymentConfig.bankFields.map((field) => (
          <div
            key={field.id}
            className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5"
          >
            <div className="min-w-0 flex-1">
              <dt className="text-xs text-muted">{field.label}</dt>
              <dd className="mt-1 select-all break-all text-sm leading-relaxed">
                {field.value}
              </dd>
            </div>
            <button
              type="button"
              onClick={() => void copy(field.id, field.value)}
              aria-label={`Copy ${field.label.toLowerCase()}`}
              className="inline-flex min-h-11 w-24 items-center justify-center gap-2 rounded-button border border-line px-3 text-xs hover:border-gold"
            >
              <LineIcon name="copy" />
              {copied === field.id
                ? paymentConfig.copy.copiedButton
                : paymentConfig.copy.copyButton}
            </button>
          </div>
        ))}
      </dl>
      <p role="status" className="min-h-4 text-xs text-muted">
        {message}
      </p>
      <div
        className="flex items-center justify-between gap-4 rounded-card border border-line bg-cream/40 px-4 py-5 text-sm text-muted"
        aria-disabled="true"
      >
        <span>{paymentConfig.copy.card}</span>
        <span className="text-xs">{paymentConfig.copy.comingSoon}</span>
      </div>
    </section>
  )
}
