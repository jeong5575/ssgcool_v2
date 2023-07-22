import React from 'react';

const Comment = ({ comment }) => {
  return (
    <div>
      <p>{comment.text}</p>
      <p>작성자: {comment.author}</p>
      <p>작성시간: {comment.time}</p>
    </div>
  );
};

export default Comment;