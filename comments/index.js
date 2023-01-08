const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');
const { type } = require('os');

const port = process.env.PORT || 4001;
const eventBusUrl = 'http://localhost:4005/events';
const eventsEndpoint = '/events';
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

  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[req.params.id] = comments;

  await axios
    .post(eventBusUrl, {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: 'pending',
      },
    })
    .then(() => {})
    .catch((err) => console.log(err.message));

  res.status(201).send(comments);
});

app.post(eventsEndpoint, async (req, res) => {
  console.log('Comments - Event Received', req.body.type);

  const { type, data } = req.body;
  const commentModerated = type === 'CommentModerated';

  if (commentModerated) {
    const { postId, id, status, content } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find((c) => {
      return c.id === id;
    });
    comment.status = status;

    await axios
      .post(`http://localhost:4005/events`, {
        type: 'CommentUpdated',
        data: {
          id,
          status,
          postId,
          content,
        },
      })
      .then(() => res.send({}))
      .catch((err) => console.log(err.message));
  }
});

app.listen(port, () => {
  console.log(`Comments service listening one ${4001}`);
});
