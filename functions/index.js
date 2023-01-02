const functions = require("firebase-functions");
const admin = require("firebase-admin/app")
const twilio = require('twilio');
const Polyline = require('@mapbox/polyline');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
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
  res.status(200).send(client.messages.create(textMessage));
});

const baseDirectionsURL = "https://maps.googleapis.com/maps/api/directions/json";
const directionsAPIKEY = functions.config().directions.apikey;

exports.getDirections = functions.https.onRequest(async (req, res) => {
  console.log("Body:", req.body);

  const startLocation = req.body.startLocation
  const destinationLocation = req.body.destinationLocation
  let resp = await fetch(`${baseDirectionsURL}?origin=${startLocation}&destination=${destinationLocation}&key=${directionsAPIKEY}`)
  let respJson = await resp.json();
  let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
  let coords = points.map((point, index) => {
      return  {
          latitude : point[0],
          longitude : point[1]
      }
  })

  const duration = respJson.routes[0].legs.reduce((carry, curr) => {
    return carry + (curr.duration_in_traffic ? curr.duration_in_traffic.value : curr.duration.value);
  }, 0) / 60
  console.log("ETA:", Math.round(duration), " mins")
  res.status(200).send({
    cordinates: coords,
    duration: duration
  });
})

const basePlacesURL = "https://maps.googleapis.com/maps/api";
const placesAPIKEY = functions.config().places.apikey;

exports.getPlaces = functions.https.onRequest(async (req, res) => {
  console.log("Autocomplete:", req.query)
  let placesResp = await fetch(`${basePlacesURL}${requestWithKey}`)
  res.status(200).send(placesResp)
});


app.use(createProxyMiddleware('/getPlaces', 
  { 
    target: `https://maps.googleapis.com/maps/api/`, 
    changeOrigin: true,
    pathRewrite: {
      [`^/getPlaces`]: '',
    },
    onProxyReq(proxyReq, req, res) {
      proxyReq.path += `&key=${placesAPIKEY}`
      console.log("request:", req.query, proxyReq.path)
    },
    onError(err, req, res, target) {
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log("Error:",err)
      res.end('Something went wrong. And we are reporting a custom error message.');
    },
    onProxyRes(proxyRes, req, res) {
      // console.log("Proxy Response", proxyRes)
    } 
  }));

exports.api = functions.https.onRequest(app);