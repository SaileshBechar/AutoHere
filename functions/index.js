const functions = require("firebase-functions");
const admin = require("firebase-admin/app")
const twilio = require('twilio');
admin.initializeApp();

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = "+12899023542";

exports.sendMessage = functions.https.onRequest(async (req, res) => {
  console.log("Body:", req.body);

  const longitude = req.body.long;
  const latitude = req.body.lat;
  const phoneNumber = req.body.phone;
  const msg = req.body.msg;

  const textMessage = {
    body: msg,
    to: phoneNumber,
    from: twilioNumber,
  };
  res.send(textMessage);
  return client.messages.create(textMessage);
});
