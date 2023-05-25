export default {
  routes: [
    {
      method: "POST",
      path: "/giftcard-confirm",
      handler: "giftcard.confirm",
      config: {
        policies: [],
      },
    },
  ],
};
