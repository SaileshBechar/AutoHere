const functions = require("firebase-functions");
const admin = require("firebase-admin/app")
const twilio = require('twilio');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

admin.initializeApp();

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = "+12899023542";

exports.sendMessage = functions.https.onRequest(async (req, res) => {
  console.log("Sending Twilio Body:", req.body);

  const longitude = req.body.long;
  const latitude = req.body.lat;
  const phoneNumber = req.body.phone;
  const msg = req.body.msg;

  const textMessage = {
    body: msg,
    to: phoneNumber,
    from: twilioNumber,
  };
  res.status(200).send(client.messages.create(textMessage));
});

const basePlacesURL = "https://maps.googleapis.com/maps/api";
const directionsAPIKEY = functions.config().directions.apikey;
const placesAPIKEY = functions.config().places.apikey;

const app = express();

// Authorization
// app.use('', (req, res, next) => {
//   if (req.headers.authorization) {
//       next();
//   } else {
//       res.sendStatus(403);
//   }
// });

app.use(createProxyMiddleware('/getDirections', 
  { 
    target: basePlacesURL, 
    changeOrigin: true,
    pathRewrite: {
      [`^/getDirections`]: '',
    },
    onProxyReq(proxyReq, req, res) {
      proxyReq.path += `&key=${directionsAPIKEY}`
      console.log("request:", req.query, proxyReq.path)
    },
}));

app.use(createProxyMiddleware('/getPlaces', 
  { 
    target: basePlacesURL, 
    changeOrigin: true,
    pathRewrite: {
      [`^/getPlaces`]: '',
    },
    onProxyReq(proxyReq, req, res) {
      proxyReq.path += `&key=${placesAPIKEY}`
      console.log("request:", req.query, proxyReq.path)
    },
}));

exports.api = functions.https.onRequest(app);