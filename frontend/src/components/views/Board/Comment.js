import React from 'react';
import { styled } from 'styled-components';
import {Button} from 'antd'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const BoardWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PostItem = styled.div`
 
  border-radius: 4px;
  padding: 10px;
`;


const Comment = ({ comment }) => {
 const navigate = useNavigate();
 
  const user = useSelector((state) => state.user.register);

  const deletecomment = async () => {
    const variables = {
      email: user.email,
      C_numb: comment.C_numb
    };
    console.log(variables)
    axios
    .post('/flask/deleteComment', variables)
    .then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
            }
    )
    .catch((error) => {
      
      console.error(error);
    });
  };
  
  return (
    <BoardWrapper><PostItem>
         {comment.email}
        {comment.TIME && (
      <span >   {new Date(comment.TIME).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
       
      })}</span>
    )}     {comment.email === user.email && <Button onClick={deletecomment}>삭제하기</Button>}
      <p><div style={{borderTop:' 1px solid #ccc'}} dangerouslySetInnerHTML={{ __html:comment.answer }} /></p>
   
      
      </PostItem>
      </BoardWrapper>
  );
};

export default Comment;