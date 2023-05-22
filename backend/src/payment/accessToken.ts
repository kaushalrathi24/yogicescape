import fetch from "node-fetch";
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const APP_SECRET = process.env.PAYPAL_APP_SECRET;

const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",

  production: "https://api-m.paypal.com",
};

export default async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");

  const response = await fetch(`${baseURL.sandbox}/v1/oauth2/token`, {
    method: "POST",

    body: "grant_type=client_credentials",

    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await response.json();
  console.log("data");
  console.log(data);
  console.log(data.access_token);

  return data.access_token;
}