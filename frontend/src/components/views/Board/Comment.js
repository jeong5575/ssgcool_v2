import React from 'react';
import { styled } from 'styled-components';

const BoardWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PostItem = styled.div`
  border-bottom: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
`;


const Comment = ({ comment }) => {

  const commentTime = new Date(comment.time);
  const formattedTime = commentTime.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
   
  });
  return (
    <BoardWrapper><PostItem>
        <p>작성자: {comment.name}</p>
        <p>작성시간: {formattedTime}</p>   
      <p>{comment.answer}</p>
    
      
      </PostItem>
      </BoardWrapper>
  );
};

export default Comment;