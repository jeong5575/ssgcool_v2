import React ,{useState}from 'react'
import {useDispatch} from 'react-redux'
import { registerUser } from '../../../_actions/user_action';
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





export default function RegisterPage(props) {


  const dispatch = useDispatch();
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

   const handleNavigation = () => {
    navigate('/login'); // Navigate to the '/login' page
   };
  
   const onFinish = (values) => {
    console.log('Received values of form:', values);
  };

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };
  
  
  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  };
  
  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  };
  
  const onSubmitHandler = (e) => {
    
    console.log('Received values of form:', e);
  if(Password !== ConfirmPassword ){
   return alert("비밀번호가 일치하지 않습니다.")
  }
  
    let body = {email : Email,password:Password,name:Name}
  
    dispatch(registerUser(body))
    .then(res=>{
      if (res.payload.success){navigate('/login')}
      else {alert('회원가입에 실패하였습니다.')}
    })
  };
  

  return (
   
      <Container>
        <Title>
          <img
            src="../cloudIMG.png"
            href="/"
            alt="Logo"
            style={{ height: '60px', marginTop: "5px", marginBottom: "0px" }}
          />
        </Title>
        <Form onFinish={onSubmitHandler}>
          <Form.Item name="nickname" value={Name} onChange={onNameHandler} rules={[{ required: true, message: '닉네임을 입력해주세요.' }]}>
            <Input placeholder="닉네임" />
          </Form.Item>
          <Form.Item name="email" value={Email} onChange={onEmailHandler} rules={[{ required: true, message: '이메일을 입력해주세요.' }]}>
            <Input type="email" placeholder="이메일" />
          </Form.Item>
          <Form.Item name="password" value={Password} onChange={onPasswordHandler} rules={[{ required: true, message: '패스워드를 입력해주세요.' }]}>
            <Input.Password placeholder="패스워드" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '패스워드를 확인해주세요.' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('패스워드가 일치하지 않습니다.'));
                },
              }),
            ]}
          >
            <Input.Password value={ConfirmPassword} onChange={onConfirmPasswordHandler} placeholder="패스워드 확인" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              가입하기
            </Button>
            <Hint>
              이미 회원이신가요? <a href="/login">로그인 하기</a>
            </Hint>
          </Form.Item>
        </Form>
      </Container>
    );
  
}
