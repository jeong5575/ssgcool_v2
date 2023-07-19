import {React,useEffect,useState} from 'react'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'
import { Button, Space } from 'antd';
import styled from 'styled-components';
import { Col, Row} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { auth } from '../../../_actions/user_action';
import { useDispatch } from 'react-redux';

const CustomButton = styled(Button)`
  color: black;
  font-size: 150%;
  margin: 0;
  padding: 0;
  background-color: white;
  &:hover {
    color: purple;
  }
`;


const CustomDiv = styled.div`
 font-size: 12px;
 text-align: right;
`;



export default function Header() {

  
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 const navigate = useNavigate();

const onClickHandlerLogout = ()=>{
  axios.get('/api/users/logout').then(res=>{if(res.data.success)
  
  {navigate('/') } else alert("로그아웃에 실패하였습니다.")
  })

}

const onClickHandlerLogin = ()=>{
  navigate('/login')
 
}


const onClickHandlerRegister = ()=>{
  navigate('/register')
 
}

useEffect(() => {
  // Check if the user is logged in
  dispatch(auth()).then(res => {
    console.log(res.payload.isAuth)
    if (res.payload.isAuth) {
      setIsLoggedIn(true);
    } 
  });
}, [dispatch]);


  return (<div>
    <Row>
      <Col span={24} style={{ marginTop: '15px', marginBottom: '0px' }}>
        <CustomDiv>
          <Space wrap size={25} align="baseline">
            <a href="/">
              <img
                src="../cloudIMG.png"
                alt="Logo"
                style={{ height: '50px', marginLeft: '10%', marginTop: '15px', marginBottom: '0px' }}
              />
            </a>
            <CustomButton type="link">질문 게시판</CustomButton>
            <CustomButton type="link">자유 게시판</CustomButton>
            <CustomButton type="link">공지 사항</CustomButton>
            {isLoggedIn ? (
              <Button onClick={onClickHandlerLogout} type="link" icon={<UserOutlined />} />
            ) : (
              <div style={{ marginRight: '165px', marginTop: '15px' }}>
                <CustomButton onClick={onClickHandlerLogin} type="link">
                  로그인
                </CustomButton>
                /
                <CustomButton onClick={onClickHandlerRegister} type="link">
                  회원가입
                </CustomButton>
              </div>
            )}
          </Space>
        </CustomDiv>
      </Col>
    </Row>
  </div>
  );
}
