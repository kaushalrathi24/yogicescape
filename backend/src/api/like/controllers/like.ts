/**
 * like controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::like.like", ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;
        const data = ctx.request.body.data;
        if(user){
            data.user = { connect: [user.id] };
        }
        const like = await strapi.entityService.create("api::like.like", {
            data,
        });
        ctx.send(like);
    },
}));

