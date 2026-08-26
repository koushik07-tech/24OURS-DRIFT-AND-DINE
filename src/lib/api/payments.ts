export interface PaymentOrderResponse {
  success: boolean;
  data?: {
    orderId: string;
    amount: number;
    amountInPaise: number;
    currency: string;
    bookingCode: string;
    keyId: string;
    isSimulated: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface PaymentVerifyResponse {
  success: boolean;
  data?: {
    success: boolean;
    bookingCode: string;
    booking?: any;
    alreadyVerified?: boolean;
  };
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export const paymentsApi = {
  /**
   * Request server-side creation of a Razorpay payment order.
   */
  async createOrder(bookingId: string): Promise<PaymentOrderResponse> {
    const res = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });
    return res.json();
  },

  /**
   * Request server-side verification of Razorpay payment signature.
   */
  async verifyPayment(payload: {
    bookingId: string;
    razorpayOrderId?: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
  }): Promise<PaymentVerifyResponse> {
    const res = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
