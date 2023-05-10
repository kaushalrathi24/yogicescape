/**
 * therapy-order controller
 */

import { factories } from "@strapi/strapi";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const getAmmount = async (id) => {
  return (
    await strapi.entityService.findOne("api::therapy.therapy", id, {
      populate: { therapy_type: true },
    })
  ).therapy_type.price;
};

export default factories.createCoreController(
  "api::therapy-order.therapy-order",
  ({ strapi }) => ({
    async create(ctx) {
      const { id } = ctx.request.body;
      const userId = ctx.state.user.id;
      const amount = await getAmmount(id);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      const clientSecret = paymentIntent.client_secret;
      const data = {
        user: { connect: [userId] },
        therapy: { connect: [id] },
        clientSecret,
      };
      await strapi.entityService.create("api::therapy-order.therapy-order", {
        data,
      });
      ctx.send({ clientSecret });
    },
  })
);
