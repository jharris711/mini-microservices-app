const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');

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
  posts[id] = { id, title };

  res.status(201).send(posts[id]);
});

app.listen(port, () => {
  console.log(`Posts Service listening on ${port}`);
});
