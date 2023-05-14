/**
 * therapy-order controller
 */

import { factories } from "@strapi/strapi";
import fetch from "node-fetch";
//const stripe = require("stripe")(process.env.STRIPE_KEY);
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const APP_SECRET = process.env.PAYPAL_APP_SECRET;

const baseURL = {
  sandbox: "https://api-m.sandbox.paypal.com",

  production: "https://api-m.paypal.com",
};

const getAmmount = async (id) => {
  return (
    await strapi.entityService.findOne("api::massage.massage", id, {
      populate: { massage_type: true },
    })
  ).massage_type.price;
};

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return await response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

async function generateAccessToken() {
  console.log(CLIENT_ID);
  console.log(APP_SECRET);
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  console.log("auth");
  console.log(auth);

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

export default factories.createCoreController(
  "api::massage-order.massage-order",
  ({ strapi }) => ({
    async create(ctx) {
      const { id } = ctx.request.body;
      const userId = ctx.state.user.id;
      const amount = await getAmmount(id);
      const accessToken = await generateAccessToken();
      const url = `${baseURL.sandbox}/v2/checkout/orders`;
      const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: "100.00",
              },
            },
          ],
        }),
      });

      //   const paymentIntent = await stripe.paymentIntents.create({
      //     amount: amount * 100,
      //     currency: "eur",
      //     automatic_payment_methods: {
      //       enabled: true,
      //     },
      //   });
      //   const clientSecret = paymentIntent.client_secret;
      //   const data = {
      //     user: { connect: [userId] },
      //     massage: { connect: [id] },
      //     clientSecret,
      //   };
      //   await strapi.entityService.create("api::massage-order.massage-order", {
      //     data,
      //   });
      //  ctx.send({ clientSecret });
      const json = await response.json();
      console.log("json");
      console.log(json);
      ctx.send(json);
    },
  })
);
