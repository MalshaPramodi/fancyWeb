import { paymentConfig } from '../config/payment.ts'
import type { OrderConfirmation } from '../store/order.ts'

// Browser-only demo: no request, upload, email or real order is created.
export async function submitMockOrder(
  delayMs = paymentConfig.mockSubmissionDelayMs,
): Promise<OrderConfirmation> {
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  return {
    id: `FT-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  }
}
