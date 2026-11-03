import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { paymentConfig } from '../config/payment'
import { formatFileSize, prepareSlip } from '../lib/slip'
import {
  setPaymentSlip,
  updatePayment,
  usePaymentStore,
} from '../store/useBoxStore'
import { FormField } from './FormField'

export function SlipUpload({
  error,
  disabled = false,
}: {
  error?: string
  disabled?: boolean
}) {
  const payment = usePaymentStore()
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const version = useRef(0)
  const preparing = useRef(false)
  useEffect(
    () => () => {
      version.current++
      if (preparing.current) updatePayment({ preparing: false })
    },
    [],
  )
  const choose = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const current = ++version.current
    setUploadError('')
    setPaymentSlip(null)
    preparing.current = true
    updatePayment({ preparing: true })
    try {
      const prepared = await prepareSlip(file)
      if (current === version.current) setPaymentSlip(prepared)
    } catch (error) {
      if (current === version.current) {
        setUploadError(
          error instanceof Error ? error.message : paymentConfig.errors.image,
        )
        if (inputRef.current) inputRef.current.value = ''
      }
    } finally {
      if (current === version.current) {
        preparing.current = false
        updatePayment({ preparing: false })
      }
    }
  }
  const remove = () => {
    version.current++
    preparing.current = false
    setPaymentSlip(null)
    updatePayment({ preparing: false })
    setUploadError('')
    if (inputRef.current) inputRef.current.value = ''
  }
  return (
    <div className="space-y-4">
      <FormField
        id="payment-slip"
        label={paymentConfig.copy.slip}
        hint={paymentConfig.copy.slipHint}
        error={uploadError || error}
      >
        {(props) => (
          <input
            {...props}
            ref={inputRef}
            className="form-control text-sm file:mr-3 file:rounded-button file:border-0 file:bg-cream file:px-3 file:py-2 file:text-xs file:text-evergreen"
            type="file"
            name="slip"
            accept={paymentConfig.upload.accept}
            disabled={disabled || payment.preparing}
            onChange={(event) => void choose(event)}
          />
        )}
      </FormField>
      <p role="status" className="text-xs text-muted">
        {payment.preparing
          ? paymentConfig.copy.preparing
          : payment.slip
            ? `${payment.slip.name} · ${formatFileSize(payment.slip.size)}`
            : ''}
      </p>
      {payment.slip && payment.previewUrl && (
        <div className="space-y-4 rounded-card border border-line p-4">
          {payment.slip.type === 'application/pdf' ? (
            <object
              data={payment.previewUrl}
              type="application/pdf"
              aria-label="Payment slip PDF preview"
              className="block h-72 w-full"
            >
              <p className="text-xs text-muted">
                {paymentConfig.copy.pdfFallback}
              </p>
            </object>
          ) : (
            <img
              src={payment.previewUrl}
              alt="Payment slip preview"
              className="max-h-72 w-full rounded-button object-contain"
            />
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href={payment.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-xs text-evergreen underline underline-offset-4"
            >
              {paymentConfig.copy.openPreview}
            </a>
            <button
              type="button"
              disabled={disabled}
              onClick={remove}
              className="min-h-11 rounded-button border border-line px-3 text-xs hover:border-gold"
            >
              {paymentConfig.copy.removeSlip}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
