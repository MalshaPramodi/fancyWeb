import { useState } from 'react'
import type { FormEvent } from 'react'
import { deliveryConfig } from '../config/delivery'
import { FormField } from '../components/FormField'
import { Receipt } from '../components/Receipt'
import { updateDelivery, useDeliveryStore } from '../store/useBoxStore'
import {
  availableDeliveryDates,
  colomboDate,
  formatDeliveryDate,
  getDeliveryArea,
  validateDelivery,
} from '../lib/delivery'
import { formatLkr } from '../lib/format'
import type { DeliveryDetails } from '../store/order'

export function Delivery({ onContinue }: { onContinue: () => void }) {
  const details = useDeliveryStore()
  const [attempt, setAttempt] = useState(0)
  const attempted = attempt > 0
  const pickup = getDeliveryArea(details.areaId)?.pickup ?? false
  const dates = availableDeliveryDates()
  const copy = deliveryConfig.copy
  const dateHint = `${deliveryConfig.isPlaceholder ? copy.exampleDatesHint : copy.datesHint}: ${dates.map(formatDeliveryDate).join(', ')}. ${deliveryConfig.isPlaceholder ? copy.exampleDeadlineHint : copy.deadlineHint}: ${formatDeliveryDate(deliveryConfig.lastOrderDate)} (${deliveryConfig.timezone}).`
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
    setAttempt((previous) => previous + 1)
    const firstError = Object.keys(validateDelivery(details))[0]
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
        {deliveryConfig.isPlaceholder && (
          <p className="rounded-button bg-gold-soft/50 px-4 py-3 text-xs leading-relaxed text-gold-dark">
            {copy.placeholderNotice}
          </p>
        )}
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
          id="delivery-areaId"
          label={copy.area}
          error={error('areaId')}
        >
          {(props) => (
            <select
              {...props}
              className="form-control"
              name="area"
              required
              value={details.areaId}
              onChange={(event) =>
                updateDelivery({ areaId: event.target.value })
              }
              onBlur={blur('areaId')}
            >
              <option value="">{copy.areaPrompt}</option>
              {deliveryConfig.areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.label} · {formatLkr(area.fee)}
                  {deliveryConfig.isPlaceholder
                    ? ` · ${copy.feePlaceholder}`
                    : ''}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField
          id="delivery-address"
          label={deliveryConfig.copy.address}
          hint={pickup ? copy.pickupAddressHint : copy.addressHint}
          error={error('address')}
        >
          {(props) => (
            <textarea
              {...props}
              className="form-control min-h-32 resize-y"
              name="address"
              autoComplete="street-address"
              rows={4}
              required={!pickup}
              disabled={pickup}
              maxLength={deliveryConfig.limits.address}
              value={details.address}
              onChange={(event) =>
                updateDelivery({ address: event.target.value })
              }
              onBlur={blur('address')}
            />
          )}
        </FormField>
        <FormField
          id="delivery-date"
          label={copy.preferredDate}
          hint={dateHint}
          error={error('date')}
        >
          {(props) => (
            <input
              {...props}
              className="form-control"
              type="date"
              name="date"
              required
              min={dates[0] ?? colomboDate()}
              max={dates.at(-1)}
              list="delivery-available-dates"
              value={details.date}
              onChange={(event) => updateDelivery({ date: event.target.value })}
              onBlur={blur('date')}
            />
          )}
        </FormField>
        <datalist id="delivery-available-dates">
          {dates.map((date) => (
            <option key={date} value={date}>
              {formatDeliveryDate(date)}
            </option>
          ))}
        </datalist>
        <div className="border-t border-line pt-7">
          <label
            htmlFor="delivery-isGift"
            className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
          >
            <input
              id="delivery-isGift"
              type="checkbox"
              name="isGift"
              className="size-4 shrink-0 accent-evergreen"
              checked={details.isGift}
              onChange={(event) =>
                updateDelivery({ isGift: event.target.checked })
              }
            />
            {copy.gift}
          </label>
          <p className="mt-1 text-xs text-muted">{copy.giftHint}</p>
        </div>
        {details.isGift && (
          <FormField
            id="delivery-giftMessage"
            label={copy.giftMessage}
            hint={`${deliveryConfig.giftMessageLimit} ${copy.characterLimit} · ${details.giftMessage.length}/${deliveryConfig.giftMessageLimit}`}
            error={error('giftMessage')}
          >
            {(props) => (
              <textarea
                {...props}
                className="form-control min-h-28 resize-y"
                name="giftMessage"
                rows={3}
                maxLength={deliveryConfig.giftMessageLimit}
                value={details.giftMessage}
                onChange={(event) =>
                  updateDelivery({ giftMessage: event.target.value })
                }
                onBlur={blur('giftMessage')}
              />
            )}
          </FormField>
        )}
      </form>
      <Receipt />
    </div>
  )
}
