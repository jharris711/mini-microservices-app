const express = require('express');
const { randomBytes } = require('crypto');

const port = process.env.PORT || 4001;
const commentsEndpoint = '/posts/:id/comments';
const commentsByPostId = {};

const app = express();
app.use(express.json());

// GET
app.get(commentsEndpoint, (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

// POST
app.post(commentsEndpoint, (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  res.status(201).send(comments);
});

app.listen(port, () => {
  console.log(`Comments service listening one ${4001}`);
});
