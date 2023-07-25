import React,{ useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../hoc/Layout';
import Comment from './Comment';
import axios from 'axios';
import { Card } from 'antd';
const PostDetailPage = ({ }) => {
    const post = useSelector((state) => state.post.selectedPost);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchComments();
      }, []);
    
      
  const fetchComments = async () => {
    try {
      // Fetch comments from the backend API based on the selected post's ID (post.B_numb)
      const response = await axios.get(`/flask/comments/${post.B_numb}`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return ( <Layout>
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p>작성자: {post.email}</p>
      <p>작성시간: {post.time}</p>
      {/* Add any other details you want to show on the detailed post page */}
    </div>
    
     {/* Display comments */}
     <div>
     <h2>개의 답변이 있어요</h2>
        {comments.map((comment) => (
          <Card key={comment.commentId} style={{ marginBottom: '16px' }}>
            <Comment comment={comment} />
          </Card>
        ))}
      </div>
      {/* 이미지 사이즈 조정 */}
      <style>{`
        img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </Layout>
  );
};

export default PostDetailPage;