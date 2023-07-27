import {React,useEffect,useState} from 'react'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'
import {Avatar, Button, Space, Dropdown, Menu,Divider } from 'antd';
import styled from 'styled-components';
import { Col, Row} from 'antd';
import { UserOutlined ,BellOutlined } from '@ant-design/icons';
import { auth } from '../../../_actions/user_action';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

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



  const onClickHandlerLogout = () => {
    axios.get('/api/users/logout').then((res) => {
      if (res.data.success) {
        navigate('/');
        setIsLoggedIn(false);
      } else alert('로그아웃에 실패하였습니다.');
    });
  };

  const onClickHandlerLogin = () => {
    navigate('/login');
  };

  const onClickHandlerRegister = () => {
    navigate('/register');
  };

  
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile">내 정보보기</Link>
      </Menu.Item>
      <Menu.Item key="2" onClick={onClickHandlerLogout}>
        로그아웃
      </Menu.Item>
    </Menu>
  );
  
  useEffect(() => {
    // Check if the user is logged in
    dispatch(auth()).then((res) => {
      console.log(res.payload.isAuth);
      if (res.payload.isAuth) {
        setIsLoggedIn(true);
      }
    });
  }, [dispatch]);

  return (
    <div>
      <Row>
        
        <Col flex={2} style={{ marginTop: '5px', marginBottom: '0px' }}>
          
            <Space wrap size={2} align="baseline">
              <a href="/">
                <img
                  src="../cloudIMG.png"
                  alt="Logo"
                  style={{ height: '50px', marginLeft: '10%', marginTop: '15px', marginBottom: '0px' }}
                />
              </a>
              </Space>
               </Col>
              <Col flex={1} style={{ fontSize:"11px" ,marginTop: '28px', marginBottom: '0px' }}>
              <Space wrap size={17} align="baseline">
              {/* <CustomButton type="link">교육 과정</CustomButton>
              <CustomButton type="link">맛집 리뷰</CustomButton> */}
              <CustomButton type="link">
                <a href="/board">커뮤니티</a>
              </CustomButton>
              {isLoggedIn ? (
                // Show the dropdown menu when the avatar is clicked
               <div>
                <Divider style={ {marginRight:'20px',height: '25px' ,backgroundColor: '#D3D3D3',}} type='vertical'/>
                <BellOutlined style={{ marginRight:'15px',fontSize: '20px', color: 'black',verticalAlign: 'middle', cursor: 'pointer'  }} /> {/* 알람 아이콘 추가 */}
                <Dropdown  overlayStyle={{ position: 'fixed' }} overlay={menu} trigger={['click']}>
                   
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ background: 'blue', color: 'white', fontWeight: 'bold',   cursor: 'pointer' }}
                  />
                </Dropdown></div>
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
         
        </Col>
        
      </Row>
    </div>
  );
}