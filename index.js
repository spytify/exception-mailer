const express = require("express");
const bodyParser = require("body-parser");
const mailer = require("nodemailer");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mailTransporter = mailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/envs", (req, res) => {
  const envs = [
    ["USER", !!process.env.EMAIL].join(": "),
    ["PASS", !!process.env.PASS].join(": "),
  ].join("</p><p>");
  res.send(`<p>${envs}</p>`);
});

app.post("/send", async (req, res) => {
  try {
    const mail = await mailTransporter.sendMail({
      from: `Spytify Exception Report <${process.env.EMAIL}>`,
      to: `Support Spytify <${process.env.EMAIL}>`,
      subject: "Spytify Exception Report",
      text: req.body.ExceptionReport,
    });
    console.log(mail.messageId);
    res.status(204).send({});
  } catch (ex) {
    console.error(ex);
  }
});

const port = 3000;
app.listen(process.env.PORT || port, function () {
  const message = "App is listening on port " + (process.env.PORT || port);
  console.log(message);
});
