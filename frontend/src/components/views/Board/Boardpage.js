import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Input, Button } from 'antd';
import styled from 'styled-components';
import Layout from '../../../hoc/Layout';
import { Navigate, useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { selectPost } from '../../../_actions/post_action';
import { EditOutlined ,QuestionOutlined } from '@ant-design/icons';

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
  margin: 10px;
  cursor: pointer;
  &:hover {
    background-color: 	#FaFAFA;
    border-color: #aaa;
  }
`;

const SearchBar = styled(Input)`
  margin-bottom: 10px;
  display: flex;
`;

const WriteButton = styled(Button)`
  background-color: 	#696969;
  margin-left: auto;
  height: 40px; /* Set the height to increase the size of the button */
  font-size: 16px; /* Set the font size to increase the text size */
  margin-left: auto;
  &:hover {
    background-color: black !important; /* Keep the background color the same on hover */
    color: white !important; /* Keep the text color the same on hover */
  }
`;

const SearchButton = styled(Button)`
  margin-bottom: 10px;
  margin-left: 10px;
`;


const SearchContainer = styled.div`
  display: flex;
  align-items: center; /* Align items vertically in the center */
`;

const BoardMenu = styled.div`
 display: flex;
  flex-direction: vertical;
  align-items: flex-start;
  margin-bottom: 20px;
`;
const MenuItem = styled(Button)`
   margin-bottom: 10px;
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  background-color: ${({ selected }) => (selected ? '#4CAF50' : 'white')};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
  border: 2px solid ${({ selected }) => (selected ? '#4CAF50' : 'black')};
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#45A049' : '#f0f0f0')};
    border-color: ${({ selected }) => (selected ? '#45A049' : '#a9a9a9')};
  }
`;

const Boardpage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [boardType, setBoardType] = useState('QnA'); // 추가: boardType 상태

  const navigate = useNavigate();

  const dispatch = useDispatch();


const removeImageTags = (htmlContent) => {
  // Use a regular expression to remove image tags from the HTML content
  const withoutImages = htmlContent.replace(/<img\b[^>]*>/gi, '');
  return withoutImages;
};


  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    //  포스트 아이디와 일치하는 포스트 찾기
    const selectedPost = posts.find((post) => post.B_numb === postId);

    if (selectedPost) {
      // Navigate to the detailed post page with the selected post data
      dispatch(selectPost(selectedPost));
      navigate('/postdetail'); 
    }
  };


  const fetchPosts = async () => {
    try {
      const response = await axios.get('/flask/posts', {
        params: {
          boardtype: boardType,  // 선택한 boardtype을 요청 파라미터로 전달
        },
      });
      setPosts(response.data);
      setSearchedPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  // 현재 페이지에 해당하는 게시물 목록 가져오기
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = searchedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = () => {
    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchedPosts(filteredPosts);
    setCurrentPage(1);
  };

  const handleWritePost = () => {
    navigate('/postboard');
  };

  const handleBoardTypeSelect =async (type) => {
   
      try {
        setBoardType(type); // 상태 변경
        console.log('clicked', type); // 수정: type 출력
    
        const response = await axios.get('/flask/posts', {
          params: {
            boardtype: type, // 선택한 boardtype을 요청 파라미터로 전달
          },
        });
    
        setPosts(response.data);
        setSearchedPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
 

  return (
    <Layout>
      <BoardWrapper>
     
        <h1>게시판</h1>
      
        <BoardMenu>
          {/* 추가: boardtype에 따른 선택 메뉴 */}
          <MenuItem selected={boardType === 'QnA'} onClick={() => handleBoardTypeSelect('QnA')}>
            질문
          </MenuItem>
          <MenuItem selected={boardType === 'free'} onClick={() => handleBoardTypeSelect('free')}>
            자유게시판
          </MenuItem>
          <MenuItem selected={boardType === 'Study'} onClick={() => handleBoardTypeSelect('Study')}>
            스터디모집
          </MenuItem>
          <WriteButton type="primary" onClick={handleWritePost}>
          <EditOutlined /> 글쓰기
        </WriteButton>
        </BoardMenu>
        
        <SearchContainer>
        <SearchBar
          placeholder="게시물 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton type="primary" onClick={handleSearch}>
          검색
        </SearchButton></SearchContainer>
     
        {currentPosts.map((post) => (
                   <PostItem key={post.B_numb} onClick={() => handlePostClick(post.B_numb)}>
                   <h3>{post.title}</h3>
                   {/*이미지 제거후 보여주기 */}
                   <PostContent dangerouslySetInnerHTML={{ __html:removeImageTags(post.content) }}/>
                   <p>작성자: {post.email}</p> 
                   {post.time && (
      <p>작성시간: {new Date(post.time).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
       
      })}</p>
    )}
                    
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