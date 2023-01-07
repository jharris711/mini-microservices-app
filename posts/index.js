const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;
const eventBusUrl = 'http://localhost:4005/events';
const eventsEndpoint = '/events';
const postsEndpoint = '/posts';
const posts = {};

app.get(postsEndpoint, (req, res) => {
  res.send(posts);
});

app.post(postsEndpoint, (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  const post = { id, title };
  posts[id] = post;

  axios.post(eventBusUrl, {
    type: 'PostCreated',
    data: post,
  });

  res.status(201).send(posts[id]);
});

app.post(eventsEndpoint, (req, res) => {
  console.log('Posts - Event Received', req.body.type);

  res.send({});
});

app.listen(port, () => {
  console.log(`Posts Service listening on ${port}`);
});
