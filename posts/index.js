const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;
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

  axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: post,
  });

  res.status(201).send(posts[id]);
});

app.listen(port, () => {
  console.log(`Posts Service listening on ${port}`);
});
