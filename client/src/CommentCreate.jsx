import React, { useState } from 'react';
import axios from 'axios';

function CommentCreate({ postId }) {
  const [content, setContent] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    const url = `http://localhost:4001/posts/${postId}/comments`;
    await axios.post(url, {
      content,
    });

    setContent('');
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