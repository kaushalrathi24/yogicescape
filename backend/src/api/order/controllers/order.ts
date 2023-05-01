/**
 * order controller
 */

import { factories } from "@strapi/strapi";
import massage from "../../massage/controllers/massage";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getAmmount = (type, id) => {
  switch (type) {
    case "event":
      const obj1 = strapi.services.event.findOne({ id });
      console.log(obj1);
      return 100;
    case "retreat":
      const obj2 = strapi.services.retreat.findOne({ id });
      console.log(obj2);
      return 100;
    case "massage":
      const obj3 = strapi.services.massage.findOne({ id });
      console.log(obj3);
      return 100;
    case "therapy":
      const obj4 = strapi.services.therapy.findOne({ id });
      console.log(obj4);
      return 100;
  }
};

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      await super.create(ctx);
      console.log(ctx.request.body);
      const { type, id, attributes } = ctx.request.body;
      const amount = 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      ctx.send({ clientSecret: paymentIntent.client_secret });
    },
  })
);
