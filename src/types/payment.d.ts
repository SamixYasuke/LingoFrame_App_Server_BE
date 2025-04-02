export interface PaystackInitializeTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackWebhookEventBody {
  event: string;
  data: PaystackWebhookEventBodyData;
}

export interface PaystackWebhookEventBodyData {
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  amount: number;
  metadata: {
    credits: string;
    package_type: string;
  };
  authorization: {
    channel: string;
    country_code: string;
  };
  reference: string;
}
