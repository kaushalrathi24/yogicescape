/**
 * mailing-list controller
 */

import { factories } from "@strapi/strapi";
import jwt from "jsonwebtoken";

export default factories.createCoreController(
  "api::mailing-list.mailing-list",
  ({ strapi }) => ({
    async delete(ctx) {
      try {
        const token = ctx.params;
        console.log(token.id);
        const user = jwt.verify(token.id, "secret");
        console.log(user);
        ctx.params = { id: user.id };
        const response = await super.delete(ctx);
        return response;
      } catch (err) {
        ctx.body = err;
      }
    },
  })
);
