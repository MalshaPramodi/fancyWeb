import { useState } from 'react'
import type { FormEvent } from 'react'
import { deliveryConfig } from '../config/delivery'
import { FormField } from '../components/FormField'
import { Receipt } from '../components/Receipt'
import { updateDelivery, useDeliveryStore } from '../store/useBoxStore'
import { validateDelivery } from '../lib/delivery'
import type { DeliveryDetails } from '../store/order'

export function Delivery({ onContinue }: { onContinue: () => void }) {
  const details = useDeliveryStore()
  const [attempted, setAttempted] = useState(false)
  const [touched, setTouched] = useState<
    Partial<Record<keyof DeliveryDetails, boolean>>
  >({})
  const errors = validateDelivery(details)
  const error = (field: keyof DeliveryDetails) =>
    attempted || touched[field] ? errors[field] : undefined
  const blur = (field: keyof DeliveryDetails) => () =>
    setTouched((previous) => ({ ...previous, [field]: true }))
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAttempted(true)
    const firstError = Object.keys(errors)[0]
    if (firstError) document.getElementById(`delivery-${firstError}`)?.focus()
    else onContinue()
  }
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.5fr_1fr]">
      <form
        id="delivery-form"
        noValidate
        onSubmit={submit}
        className="min-w-0 space-y-7"
      >
        {attempted && Object.keys(errors).length > 0 && (
          <p role="alert" className="text-sm text-burgundy">
            {deliveryConfig.copy.errorsSummary}
          </p>
        )}
        <FormField
          id="delivery-name"
          label={deliveryConfig.copy.name}
          error={error('name')}
        >
          {(props) => (
            <input
              {...props}
              className="form-control"
              name="name"
              autoComplete="name"
              required
              maxLength={deliveryConfig.limits.name}
              value={details.name}
              onChange={(event) => updateDelivery({ name: event.target.value })}
              onBlur={blur('name')}
            />
          )}
        </FormField>
        <FormField
          id="delivery-phone"
          label={deliveryConfig.copy.phone}
          hint={deliveryConfig.copy.phoneHint}
          error={error('phone')}
        >
          {(props) => (
            <input
              {...props}
              className="form-control"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              maxLength={24}
              value={details.phone}
              onChange={(event) =>
                updateDelivery({ phone: event.target.value })
              }
              onBlur={blur('phone')}
            />
          )}
        </FormField>
        <FormField
          id="delivery-address"
          label={deliveryConfig.copy.address}
          hint={deliveryConfig.copy.addressHint}
          error={error('address')}
        >
          {(props) => (
            <textarea
              {...props}
              className="form-control min-h-32 resize-y"
              name="address"
              autoComplete="street-address"
              rows={4}
              required
              maxLength={deliveryConfig.limits.address}
              value={details.address}
              onChange={(event) =>
                updateDelivery({ address: event.target.value })
              }
              onBlur={blur('address')}
            />
          )}
        </FormField>
      </form>
      <Receipt />
    </div>
  )
}
