module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "amazon-ses",
      providerOptions: {
        key: env("AWS_SES_KEY"),
        secret: env("AWS_SES_SECRET"),
        amazon: env("AWS_URL"),
      },
      settings: {
        defaultFrom: "developer@yogicescape.com",
        defaultReplyTo: "kaushalrathi24@gmail.com",
      },
    },
  },
});
