export type PaymentProviderBoundaryPolicy = {
  paymentProviderBoundaryDefined: true;
  providerSdkIntegrated: false;
  checkoutSessionImplemented: false;
  chargeExecutionImplemented: false;
  paymentMethodStorageImplemented: false;
  providerWebhookImplemented: false;
};

export function getPaymentProviderBoundaryPolicy(): PaymentProviderBoundaryPolicy {
  return {
    paymentProviderBoundaryDefined: true,
    providerSdkIntegrated: false,
    checkoutSessionImplemented: false,
    chargeExecutionImplemented: false,
    paymentMethodStorageImplemented: false,
    providerWebhookImplemented: false,
  };
}
