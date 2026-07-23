// Tuma Payment Solutions integration — routes a customer's push-payment
// prompt straight into your I&M Bank account.
// Requires these environment variables, obtained by signing up (free,
// self-service) at https://merchant.tuma.co.ke, then adding your I&M
// account under Business Profile, then Developer → Generate API Keys:
//   TUMA_EMAIL     (the business profile email you registered with)
//   TUMA_API_KEY   (from Developer → API Keys)
//   TUMA_CALLBACK_URL   (your live site's URL + /api/tuma/callback)

const BASE_URL = "https://api.tuma.co.ke";

async function getAccessToken(): Promise<string> {
  const email = process.env.TUMA_EMAIL;
  const apiKey = process.env.TUMA_API_KEY;
  if (!email || !apiKey) {
    throw new Error("Bank payment is not configured yet — missing Tuma credentials.");
  }

  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, api_key: apiKey }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Could not authenticate with Tuma.");
  }
  return data.data.token;
}

export async function initiateBankPush(params: {
  phone: string;
  amount: number;
  description: string;
}): Promise<{ checkoutRequestId: string; merchantRequestId: string }> {
  const callbackUrl = process.env.TUMA_CALLBACK_URL;
  if (!callbackUrl) {
    throw new Error("Bank payment is not fully configured yet — missing callback URL.");
  }

  const token = await getAccessToken();

  const res = await fetch(`${BASE_URL}/payment/stk-push`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.ceil(params.amount),
      phone: params.phone,
      callback_url: callbackUrl,
      description: params.description,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Bank payment request failed.");
  }

  return {
    checkoutRequestId: data.data.checkout_request_id,
    merchantRequestId: data.data.merchant_request_id,
  };
}
