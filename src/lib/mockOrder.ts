import { paymentConfig } from '../config/payment.ts'
import type { OrderConfirmation, OrderPayload } from '../store/order.ts'

// Browser-only demo: no request, upload, email or real order is created.
export async function submitMockOrder(
  payload: OrderPayload,
  delayMs = paymentConfig.mockSubmissionDelayMs,
): Promise<OrderConfirmation> {
  const submitted = structuredClone(payload)
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  return {
    ...submitted,
    id: `FT-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  }
}
