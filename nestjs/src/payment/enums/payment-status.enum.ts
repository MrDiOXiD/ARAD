export enum PaymentStatus {
  PENDING  = 'pending',   // trackId obtained, user not yet redirected or mid-payment
  PAID     = 'paid',      // Zibal callback received with success=1 (not yet verified server-side)
  VERIFIED = 'verified',  // POST /v1/verify returned result: 100 — source of truth
  FAILED   = 'failed',    // Zibal verify returned non-100, or user cancelled
  REFUNDED = 'refunded',  // future: manual refund recorded
}
