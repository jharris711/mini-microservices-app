const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 4002;

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  console.log('Query - Event Received', req.body.type);
  const { type, data } = req.body;
  const postCreated = type === 'PostCreated';
  const commentCreated = type === 'CommentCreated';
  const commentUpdated = type === 'CommentUpdated';

  if (postCreated) {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }
  if (commentCreated) {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (commentUpdated) {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((c) => {
      return c.id === id;
    });
    comment.status = status;
    comment.content = content;
  }

  res.send({});
});

app.listen(port, () => {
  console.log(`Query service listening on ${port}`);
});
