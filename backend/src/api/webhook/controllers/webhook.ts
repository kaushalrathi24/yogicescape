export default {
  async index(ctx) {
    const event = ctx.request.body;
    console.log(event);
    switch (event.type) {
      case "payment_intent.succeeded":
        const clientSecret = event.data.object.client_secret;
        const massageOrder = await strapi.entityService.findOne(
          "api::massage-order.massage-order",
          {
            clientSecret,
          }
        );
        if (massageOrder) {
          await strapi.entityService.update(
            "api::massage-order.massage-order",
            massageOrder.id,
            {
              payment: true,
            }
          );
          return ctx.send();
        }
        const therapyOrder = await strapi.entityService.findOne(
          "api::therapy-order.therapy-order",
          {
            clientSecret,
          }
        );
        if (therapyOrder) {
          await strapi.entityService.update(
            "api::therapy-order.therapy-order",
            therapyOrder.id,
            {
              payment: true,
            }
          );
          return ctx.send();
        }
    }
  },
};
