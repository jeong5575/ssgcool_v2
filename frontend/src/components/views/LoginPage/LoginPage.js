import React, { useState } from 'react';
import {useDispatch} from 'react-redux'
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Row, Col } from 'antd';
import styled from 'styled-components';


const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  margin-top: 10%;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Hint = styled.p`
  color: #777;
  font-size: 14px;
  margin-top: 5px;
`;




export default function LoginPage(props) {
  

const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const onEmailHandler = (e) => {
    console.log("sea"+(e.currentTarget.value))
    setEmail(e.currentTarget.value);
  };

  const onPasswordHandler = (e) => {
   
    setPassword(e.currentTarget.value);
    console.log("set password"+(e.currentTarget.value))
  };

  const onSubmitHandler = (e) => {
    
    console.log('Received values of form:', e);
    console.log("로그인 요청 보냄")
    console.log(e.email)
    setEmail(e.email)
    setPassword(e.password)
    let body = {email : e.email,password:e.password}
    
    console.log(body)
    dispatch(loginUser(body))
    .then(res=>{
      if (res.payload.loginSuccess){navigate('/')}
      else {alert(res.payload.message)}
    })
  };

  const onFinish = (values) => {
    console.log('Received values of form:', values);
  
  };

  const onClickHandlerRegister = ()=>{
  
    navigate('/register') 
   
  }
   
    return (
      <Container>
        <Title>
          <a href='/'>
            <img
              src="../cloudIMG.png"
              alt="Logo"
              style={{ height: '60px', marginTop: "5px", marginBottom: "0px" }}
            />
          </a>
        </Title>
        <Form onFinish={onSubmitHandler}>
          <Form.Item name="email" value={Email} onChange={onEmailHandler} rules={[{ required: true, message: '이메일을 입력해주세요.' }]}>
            <Input type="email" placeholder="이메일" />
          </Form.Item>
          <Form.Item name="password" value={Password} onChange={onPasswordHandler} rules={[{ required: true, message: '패스워드를 입력해주세요.' }]}>
            <Input.Password placeholder="패스워드" />
          </Form.Item>
    
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              로그인하기
            </Button>
            <Hint>
              회원이 아니신가요?<a href="/register">회원가입 하기</a>
            </Hint>
          </Form.Item>
        </Form>
      </Container>
    );
}