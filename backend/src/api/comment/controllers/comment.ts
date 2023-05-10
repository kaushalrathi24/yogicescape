/**
 * comment controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::comment.comment",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      const data = ctx.request.body.data;
      data.user = { connect: [user.id] };
      const comment = await strapi.entityService.create(
        "api::comment.comment",
        {
          data,
        }
      );
      ctx.send(comment);
    },
  })
);
