const formData = require("form-data");
const Mailgun = require("mailgun.js");
const jwt = require("jsonwebtoken");
const mailgun = new Mailgun(formData);


module.exports = {
  async afterCreate(event) {
    console.log("je;;p");
    const { result } = event;

    try {
      let emails = await strapi.entityService.findMany(
        "api::mailing-list.mailing-list",
        {
          fields: ["Email"],
        }
      );
      emails = emails.map((email) => {
        return email.Email;
      });

      var token = jwt.sign({ id: 3 }, "secret");
      const url = "http://localhost:1337/api/mailing-lists/" + token;
      console.log(token);
      console.log(url);

      const client = mailgun.client({
        username: "api",
        key: "key",
      });

      const data = {
        from: "User <mailgun@sandboxd2dbaa69682444168a02e45d8ade8bcf.mailgun.org>",
        to: emails,
        subject: "test",
        template: result.template,
        "v:unsubscribeUrl": url,
      };

      client.messages
        .create("Domain", data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(emails);
      console.log(result.template);
    } catch (err) {
      console.log(err);
    }
  },
};
