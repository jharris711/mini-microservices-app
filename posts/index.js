const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;
const getPostsEndpoint = '/posts';
const createPostEndpoint = '/posts/create';
const eventsEndpoint = '/events';
const eventBusUrl = 'http://event-bus-srv:4005/events';
const posts = {};

/**
 * GET /posts
 * @returns { Object } An object containing all the posts.
 */
app.get(getPostsEndpoint, (req, res) => {
  res.send(posts);
});

/**
 * POST /posts
 * @param { Object } body - The request body, containing the post to be added.
 * @returns { Object } The newly added post.
 */
app.post(createPostEndpoint, async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  const post = { id, title };
  posts[id] = post;

  await axios
    .post(eventBusUrl, {
      type: 'PostCreated',
      data: post,
    })
    .then(() => res.status(201).send(posts[id]))
    .catch((err) => console.log(err.message));
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
  console.log('v2');
  console.log(`Posts Service listening on ${port}`);
});
