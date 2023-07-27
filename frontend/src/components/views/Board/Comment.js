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
`;


const Comment = ({ comment }) => {

  
  return (
    <BoardWrapper><PostItem>
         {comment.email}
        {comment.TIME && (
      <span>   {new Date(comment.TIME).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
       
      })}{console.log(comment)}</span>
    )}   
      <p>{comment.answer}</p>
    
      
      </PostItem>
      </BoardWrapper>
  );
};

export default Comment;