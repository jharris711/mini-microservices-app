const express = require('express');
const cors = require('cors');
const axios = require('axios');

const port = process.env.PORT || 4002;

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
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
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  console.log('Query - Event Received', req.body.type);
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(port, async () => {
  console.log(`Query service listening on ${port}`);
  await axios
    .get('http://localhost:4005/events')
    .then((res) => {
      for (let event of res.data) {
        console.log(`Processing event: ${event.type}`);
        handleEvent(event.type, event.data);
      }
    })
    .catch((err) => console.log(err.message));
});
