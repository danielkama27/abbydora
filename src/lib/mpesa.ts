// M-Pesa Daraja API integration (Safaricom's official payment API for Kenya).
// Requires these environment variables, obtained from a Safaricom Daraja
// developer account (see the README section on M-Pesa setup):
//   MPESA_CONSUMER_KEY
//   MPESA_CONSUMER_SECRET
//   MPESA_SHORTCODE       (your Paybill/Till number — use 174379 for sandbox testing)
//   MPESA_PASSKEY
//   MPESA_ENV             ("sandbox" or "production")
//   MPESA_CALLBACK_URL    (your live site's URL + /api/mpesa/callback)

const BASE_URL =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

async function getAccessToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) {
    throw new Error("M-Pesa is not configured yet — missing consumer key/secret.");
  }

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) {
    throw new Error("Could not authenticate with M-Pesa. Check your Daraja credentials.");
  }
  const data = await res.json();
  return data.access_token;
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

// Normalizes a Kenyan phone number to the 2547XXXXXXXX format Safaricom requires.
export function normalizeMpesaPhone(phone: string): string {
  let p = phone.replace(/[\s+\-]/g, "");
  if (p.startsWith("0")) p = "254" + p.slice(1);
  if (p.startsWith("7") || p.startsWith("1")) p = "254" + p;
  return p;
}

export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}): Promise<{ checkoutRequestId: string; merchantRequestId: string }> {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  if (!shortcode || !passkey || !callbackUrl) {
    throw new Error("M-Pesa is not fully configured yet — missing shortcode, passkey, or callback URL.");
  }

  const accessToken = await getAccessToken();
  const ts = timestamp();
  const password = Buffer.from(`${shortcode}${passkey}${ts}`).toString("base64");
  const phone = normalizeMpesaPhone(params.phone);

  const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: ts,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(params.amount),
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: params.accountReference,
      TransactionDesc: params.transactionDesc,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.errorCode) {
    throw new Error(data.errorMessage || data.errorCode || "M-Pesa payment request failed.");
  }

  return { checkoutRequestId: data.CheckoutRequestID, merchantRequestId: data.MerchantRequestID };
}
