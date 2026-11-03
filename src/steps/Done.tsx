import { paymentConfig } from '../config/payment'
import { ClosingBox } from '../components/ClosingBox'
import { Receipt } from '../components/Receipt'
import {
  useBoxStore,
  useDeliveryStore,
  usePaymentStore,
} from '../store/useBoxStore'
import { formatDeliveryDate, getDeliveryArea } from '../lib/delivery'
import type { OrderConfirmation } from '../store/order'
import { buildWhatsAppLink } from '../lib/whatsapp'

export function Done({
  order,
  onOrderAgain,
}: {
  order: OrderConfirmation
  onOrderAgain: () => void
}) {
  const delivery = useDeliveryStore()
  const box = useBoxStore()
  const payment = usePaymentStore()
  const copy = paymentConfig.done
  const area = getDeliveryArea(delivery.areaId)
  const whatsapp = buildWhatsAppLink(order, box, delivery)
  return (
    <div className="space-y-8">
      <div className="text-center">
        <ClosingBox />
        <p className="mt-3 text-[10px] uppercase tracking-widest text-muted">
          {copy.reference}
        </p>
        <p className="mt-2 break-all font-display text-3xl text-evergreen">
          {order.id}
        </p>
        <p
          role="status"
          className="mx-auto mt-4 w-fit rounded-button border border-line bg-evergreen-soft px-4 py-2 text-xs text-evergreen"
        >
          {copy.status}
        </p>
        <p className="mx-auto mt-5 max-w-lg rounded-button bg-gold-soft/50 px-4 py-3 text-xs leading-relaxed text-gold-dark">
          {copy.notice}
        </p>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section
          className="min-w-0 rounded-card border border-line p-6"
          aria-label={copy.details}
        >
          <h3 className="font-display text-3xl">{copy.details}</h3>
          <dl className="mt-5 space-y-5 text-sm">
            <div>
              <dt className="text-xs text-muted">{copy.name}</dt>
              <dd className="mt-1 break-words">{delivery.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{copy.phone}</dt>
              <dd className="mt-1">{delivery.phone}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{copy.area}</dt>
              <dd className="mt-1">{area?.label}</dd>
            </div>
            {!area?.pickup && (
              <div>
                <dt className="text-xs text-muted">{copy.address}</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words">
                  {delivery.address}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted">{copy.date}</dt>
              <dd className="mt-1">{formatDeliveryDate(delivery.date)}</dd>
            </div>
            {delivery.isGift && delivery.giftMessage && (
              <div>
                <dt className="text-xs text-muted">{copy.gift}</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words">
                  {delivery.giftMessage}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted">{copy.slip}</dt>
              <dd className="mt-1 break-all">{payment.slip?.name}</dd>
            </div>
          </dl>
        </section>
        <Receipt />
      </div>
      <div className="space-y-3 text-center">
        <div className="flex justify-center">
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-button border border-evergreen px-4 text-sm hover:border-gold"
            >
              {copy.whatsapp}
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-describedby="whatsapp-unavailable"
              className="min-h-11 rounded-button border border-line px-4 text-sm text-muted opacity-60"
            >
              {copy.whatsapp}
            </button>
          )}
        </div>
        {!whatsapp && (
          <p id="whatsapp-unavailable" className="text-xs text-muted">
            {copy.whatsappUnavailable}
          </p>
        )}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onOrderAgain}
          className="min-h-11 rounded-button border border-evergreen bg-evergreen px-5 text-sm text-ivory hover:bg-evergreen-dark"
        >
          {copy.orderAgain}
        </button>
      </div>
    </div>
  )
}
