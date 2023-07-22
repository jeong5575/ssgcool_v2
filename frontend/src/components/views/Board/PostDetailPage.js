import React,{ useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../hoc/Layout';
import Comment from './Comment';
import axios from 'axios';

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
        <h2>댓글</h2>
        {comments.map((comment) => (
          <CommentItem key={comment.commentId} comment={comment} />
        ))}
      </div>
      
    </Layout>
  );
};

export default PostDetailPage;