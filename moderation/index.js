const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const port = process.env.PORT || 4003;

app.post('/events', (req, res) => {});

app.listen(port, () => {
  console.log(`Moderation service listening on ${port}`);
});
