export default {
  routes: [
    {
      method: "POST",
      path: "/webhook",
      handler: "webhook.index",
      config: {
        policies: [],
      },
    },
  ],
};
