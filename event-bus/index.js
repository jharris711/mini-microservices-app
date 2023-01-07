const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/events', (req, res) => {
  const event = req.body;

  axios
    .post('http://localhost:4000/events', event)
    .then((res) => console.log(res))
    .catch((err) =>
      console.log(`Error sending event to Posts Service: ${err.message}`)
    );
  axios
    .post('http://localhost:4001/events', event)
    .then((res) => console.log(res))
    .catch((err) =>
      console.log(`Error sending event to Comments Service: ${err.message}`)
    );
  axios
    .post('http://localhost:4002/events', event)
    .then((res) => console.log(res))
    .catch((err) =>
      console.log(`Error sending event to Query Service: ${err.message}`)
    );

  res.send({ status: 'OK' });
});

app.listen(4005, () => {
  console.log('Event-bus listening on 4005');
});
