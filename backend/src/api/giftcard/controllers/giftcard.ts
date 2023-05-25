/**
 * giftcard controller
 */

const { v4: uuidv4 } = require("uuid");
import { factories } from "@strapi/strapi";
import createOrder from "../../../payment/create";
import confirmOrder from "../../../payment/confirm";

export default factories.createCoreController(
  "api::giftcard.giftcard",
  ({ strapi }) => ({
    async create(ctx) {
      const { id, quantity, email, name, date, message } = ctx.request.body;
      const price = await strapi.entityService.findOne(
        "api::giftcard-type.giftcard-type",
        id
      ).price;
      const amount = price * quantity;
      const orderId = await createOrder(amount);
      for (let i = 0; i < quantity; i++) {
        const code = uuidv4();
        const data = {
          balance: price,
          uid: code,
          email,
          name,
          message,
          orderId,
          date,
        };
        await strapi.entityService.create("api::giftcard.giftcard", {
          data,
        });
      }
    },

    async confirm(ctx) {
      const { orderId } = ctx.request.body;
      const confirmation: Boolean = await confirmOrder(orderId);
      if (confirmation) {
        const giftcards = await strapi.entityService.find(
          "api::giftcard.giftcard",
          {
            fields: ["id"],
            filters: { orderId },
          }
        );
        for (let i = 0; i < giftcards.length; i++) {
          const giftcard = giftcards[i];
          await strapi.entityService.update("api::giftcard.giftcard", {
            id: giftcard.id,
            data: {
              confirmed: true,
            },
          });
        }
      }
    },
  })
);
