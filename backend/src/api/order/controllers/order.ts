/**
 * order controller
 */

import { factories } from "@strapi/strapi";
import massage from "../../massage/controllers/massage";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getAmmount = async (type, id) => {
  switch (type) {
    case "event":
      return (await strapi.entityService.findOne("api::event.event", id)).Price;
    case "retreat":
      return (await strapi.entityService.findOne("api::retreat.retreat", id)).Price;
    case "massage":
      return (await strapi.entityService.findOne("api::massage.massage", id)).price;
    case "therapy":
      return (await strapi.entityService.findOne("api::therapy.therapy", id)).price;
  }
};

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx) {
      await super.create(ctx);
      const { type, id, attributes } = ctx.request.body;
      const amount = await getAmmount(type, id);
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
