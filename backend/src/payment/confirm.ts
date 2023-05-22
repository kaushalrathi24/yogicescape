import fetch from "node-fetch";
import generateAccessToken from "./accessToken";

const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",

  production: "https://api-m.paypal.com",
};

export default async function confirmOrder(orderId: string) {
  const accessToken = await generateAccessToken();
  const response = await fetch(
    `${baseURL.sandbox}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data.status === "COMPLETED";
}
