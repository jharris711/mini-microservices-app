import React, { useState } from 'react';
import axios from 'axios';

function CommentCreate({ postId }) {
  const [content, setContent] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    const url = `http://posts.com/posts/${postId}/comments`;
    await axios
      .post(url, {
        content,
      })
      .then(() => setContent(''))
      .catch((err) => console.log(err.message));
  };

  return (
    <div>
      <form onSubmit={onSubmit} action=''>
        <div className='form-group'>
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className='form-control'
            type='text'
          />
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
}

export default CommentCreate;
