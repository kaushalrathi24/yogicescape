export default {
  routes: [
    {
      method: "POST",
      path: "/massage-order-confirm",
      handler: "massage-order.confirm",
      config: {
        policies: [],
      },
    },
  ],
};
