const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const events = [];

/**
 * POST /events
 * @param { Object } body - The request body, containing the event to be broadcast.
 * @returns { Object } An object with a "status" field, indicating the status of the broadcast.
 */
app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios
    .post('http://localhost:4000/events', event)
    .then((res) => console.log('OK - (Posts)'))
    .catch((err) =>
      console.log(`Error sending event to Posts Service: ${err.message}`)
    );
  axios
    .post('http://localhost:4001/events', event)
    .then((res) => console.log('OK - (Comments)'))
    .catch((err) =>
      console.log(`Error sending event to Comments Service: ${err.message}`)
    );
  axios
    .post('http://localhost:4002/events', event)
    .then((res) => console.log('OK - (Query)'))
    .catch((err) =>
      console.log(`Error sending event to Query Service: ${err.message}`)
    );
  axios
    .post('http://localhost:4003/events', event)
    .then((res) => console.log('OK - (Moderation)'))
    .catch((err) =>
      console.log(`Error sending event to Moderation Service: ${err.message}`)
    );

  res.send({ status: 'OK' });
});

/**
 * GET /events
 * @returns { Array } An array of events that have been received by the service.
 */
app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log('Event-bus listening on 4005');
});
