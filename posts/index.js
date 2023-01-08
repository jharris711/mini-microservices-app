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

/**
 * GET /posts
 * @returns { Object } An object containing all the posts.
 */
app.get(postsEndpoint, (req, res) => {
  res.send(posts);
});

/**
 * POST /posts
 * @param { Object } body - The request body, containing the post to be added.
 * @returns { Object } The newly added post.
 */
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

/**
 * POST /events
 * @param { Object } body - The request body, containing the event to be processed.
 * @returns { Object } An empty object.
 */
app.post(eventsEndpoint, (req, res) => {
  console.log('Posts - Event Received', req.body.type);

  res.send({});
});

app.listen(port, () => {
  console.log(`Posts Service listening on ${port}`);
});
