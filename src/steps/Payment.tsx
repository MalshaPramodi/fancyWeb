import { BankDetails } from '../components/BankDetails'
import { Receipt } from '../components/Receipt'
import {
  useBoxStore,
  useDeliveryStore,
  usePaymentStore,
  updatePayment,
} from '../store/useBoxStore'
import { boxTotal } from '../store/box'
import { getDeliveryFee } from '../lib/delivery'
import { paymentConfig } from '../config/payment'
import { SlipUpload } from '../components/SlipUpload'
import { useState } from 'react'
import type { FormEvent } from 'react'

export function Payment({
  onConfirm,
  submitting = false,
  error,
}: {
  onConfirm?: () => void
  submitting?: boolean
  error?: string
}) {
  const box = useBoxStore()
  const delivery = useDeliveryStore()
  const payment = usePaymentStore()
  const [attempted, setAttempted] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting || payment.preparing) return
    setAttempted(true)
    if (!payment.slip) document.getElementById('payment-slip')?.focus()
    else if (!payment.confirmed)
      document.getElementById('payment-confirmed')?.focus()
    else onConfirm?.()
  }
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="min-w-0">
        <BankDetails total={boxTotal(box, getDeliveryFee(delivery.areaId))} />
        <form
          id="payment-form"
          noValidate
          onSubmit={submit}
          className="mt-8 space-y-6 border-t border-line pt-8"
        >
          {error && (
            <p role="alert" className="text-sm text-burgundy">
              {error}
            </p>
          )}
          <SlipUpload
            disabled={submitting}
            error={
              attempted && !payment.slip
                ? paymentConfig.errors.missingSlip
                : undefined
            }
          />
          <p className="text-xs leading-relaxed text-muted">
            {paymentConfig.copy.mockHint}
          </p>
          <label
            htmlFor="payment-confirmed"
            className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-relaxed"
          >
            <input
              id="payment-confirmed"
              type="checkbox"
              required
              className="mt-1 size-4 shrink-0 accent-evergreen"
              checked={payment.confirmed}
              disabled={submitting || payment.preparing}
              onChange={(event) =>
                updatePayment({ confirmed: event.target.checked })
              }
              aria-invalid={attempted && !payment.confirmed}
              aria-describedby={
                attempted && !payment.confirmed
                  ? 'payment-confirmed-error'
                  : undefined
              }
            />
            {paymentConfig.copy.acknowledgement}
          </label>
          {attempted && !payment.confirmed && (
            <p id="payment-confirmed-error" className="text-xs text-burgundy">
              {paymentConfig.errors.acknowledgement}
            </p>
          )}
          <p id="next-step-help" className="text-xs text-muted">
            {paymentConfig.copy.confirmHelp}
          </p>
        </form>
      </div>
      <Receipt />
    </div>
  )
}
