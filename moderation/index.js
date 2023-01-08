const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const port = process.env.PORT || 4003;

/**
 * POST /events
 * @param { Object } body - The request body, containing the event to be processed.
 * @returns { Object } An empty object.
 */
app.post('/events', async (req, res) => {
  console.log('Moderation - Event Received', req.body.type);
  const { type, data } = req.body;
  const commentCreated = type === 'CommentCreated';

  if (commentCreated) {
    const status = data.content.includes(`orange`) ? 'rejected' : 'approved';

    await axios
      .post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      })
      .then(() => res.send({}))
      .catch((err) => console.log(`Error moderating comment`));
  }
});

app.listen(port, () => {
  console.log(`Moderation service listening on ${port}`);
});
