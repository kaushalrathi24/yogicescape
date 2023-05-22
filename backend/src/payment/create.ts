import fetch from "node-fetch";
import generateAccessToken from "./accessToken";

const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",

  production: "https://api-m.paypal.com",
};

export default async function createOrder(amount: number) {
  const accessToken = await generateAccessToken();
  const response = await fetch(`${baseURL.sandbox}/v2/checkout/orders`, {
    method: "POST",

    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: String(amount),
          },
        },
      ],
    }),

    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data.id;
}
