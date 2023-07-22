import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Input, Button } from 'antd';
import styled from 'styled-components';
import Layout from '../../../hoc/Layout';

const PostContent = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Show only 2 lines */
  -webkit-box-orient: vertical;
`;

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

const SearchBar = styled(Input)`
  margin-bottom: 10px;
`;

const WriteButton = styled(Button)`
  margin-bottom: 10px;
`;

const SearchButton = styled(Button)`
  margin-bottom: 10px;
  margin-left: 10px;
`;


const Boardpage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5); // 페이지 당 게시물 수
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedPosts, setSearchedPosts] = useState([]);

  // 게시글 목록 가져오기
  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    // Navigate to the detailed post page using the postId
    // Add your navigation logic here
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/flask/posts');
      setPosts(response.data);  setSearchedPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 변경
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 게시물 검색
  const handleSearch = () => {
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchedPosts(filteredPosts);
    setCurrentPage(1);
  };

  const handleWritePost = () => {
    // Handle write post logic
  };

  return (
    <Layout>
      <BoardWrapper>
        <h1>게시판</h1>
        <SearchBar
          placeholder="게시물 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton type="primary" onClick={handleSearch}>
          검색
        </SearchButton>
        <WriteButton type="primary" onClick={handleWritePost}>
          글쓰기
        </WriteButton>
        {currentPosts.map((post) => (
        <PostItem key={post.B_numb} onClick={() => handlePostClick(post.B_numb)}>
          <h3>{post.title}</h3>
          <PostContent>{post.content}</PostContent>
          <p>작성자: {post.email}</p>
          <p>작성시간: {post.time}</p>
        </PostItem>
      ))}
        <Pagination
          current={currentPage}
          total={searchedPosts.length}
          pageSize={postsPerPage}
          onChange={paginate}
        />
      </BoardWrapper>
    </Layout>
  );
};

export default Boardpage;