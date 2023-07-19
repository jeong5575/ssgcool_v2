import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'antd';
import styled from 'styled-components';

const BoardWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PostItem = styled.div`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
`;

const Boardpage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // 페이지 당 게시물 수

  // 게시글 목록 가져오기
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 변경
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 페이지 번호 목록 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <BoardWrapper>
      <h1>게시판</h1>
      {currentPosts.map((post) => (
        <PostItem key={post.B_numb}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>작성자: {post.email}</p>
          <p>작성시간: {post.time}</p>
        </PostItem>
      ))}
      <Pagination
        current={currentPage}
        total={posts.length}
        pageSize={postsPerPage}
        onChange={paginate}
      />
    </BoardWrapper>
  );
};

export default Boardpage;