const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

const port = process.env.PORT || 4001;
const commentsEndpoint = '/posts/:id/comments';
const commentsByPostId = {};

const app = express();
app.use(express.json());
app.use(cors());

// GET
app.get(commentsEndpoint, (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// POST
app.post(commentsEndpoint, async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  await axios
    .post('http://localhost:4005/events', {
      type: 'ContentCreated',
      data: { id: commentId, content, postId: req.params.id },
    })
    .then(() => {})
    .catch((err) => console.log(err.message));

  res.status(201).send(comments);
});

app.listen(port, () => {
  console.log(`Comments service listening one ${4001}`);
});
