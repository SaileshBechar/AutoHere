const functions = require("firebase-functions");
const admin = require("firebase-admin/app")
const twilio = require('twilio');
admin.initializeApp();
// admin.initializeApp(functions.config().firebase);

// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

console.log(`Twilio account: ${accountSid}`);

const client = new twilio(accountSid, authToken);

const twilioNumber = "+12899023542";

exports.sendMessage = functions.https.onRequest(async (req, res) => {
  console.log(req);

  const longitude = req.query.long;
  const latitude = req.query.lat;
  const phoneNumber = req.query.phone;

  const textMessage = {
    body: `See user position at Google: http://www.google.com/maps/place/${latitude},${longitude}`,
    to: phoneNumber,
    from: twilioNumber,
  };
  res.send(textMessage);
  return client.messages.create(textMessage);
});
