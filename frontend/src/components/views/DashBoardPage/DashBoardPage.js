import {React,useEffect} from 'react'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'
import { Button, Space } from 'antd';
import styled from 'styled-components';
import { Divider ,Col, Row} from 'antd';



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

const CustomDivider = styled(Divider)`

    border-width: 1.0px;
    border-color: #c2c3cd;
`;



export default function DashBoardPage() {


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
    




  return (<div>
    <Row >
     <Col span={8} offset={2}> 
     <a href='/'><img src="../cloudIMG.png" alt="Logo" 
     style={{ height: '50px', marginLeft: '10%',marginTop:"15px", marginBottom:"0px"}} /></a>
  </Col>
  <Col span={11} offset={3} style={{marginTop:"15px", marginBottom:"0px"}}>
    <CustomDiv>
      
  
      <Space wrap size={25} align='baseline' >
        <CustomButton type="link" >
          질문 게시판
        </CustomButton>
        <CustomButton type="link" >
          자유 게시판
  
        </CustomButton>
        <CustomButton type="link" >
          공지 사항
  
        </CustomButton>
  
        <div style={{ marginRight: "165px", marginTop: "15px" }}>
          <CustomButton onClick={onClickHandlerLogout} type="link" >
            로그아웃
          </CustomButton>
        </div>
      </Space>
  
    </CustomDiv>
    </Col>
    </Row>
    <CustomDivider ></CustomDivider>
    </div>
  )
}
