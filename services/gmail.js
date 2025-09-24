// services/gmail.js
const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

async function sendEmail(to, subject, text) {
  const mail = new MailComposer({
    to,
    text,
    subject,
    from: process.env.SENDER_EMAIL,
  });

  const message = await new Promise((resolve, reject) => {
    mail.compile().build((err, msg) => {
      if (err) reject(err);
      else resolve(msg);
    });
  });

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });

  return res.data;
}

module.exports = { sendEmail };
