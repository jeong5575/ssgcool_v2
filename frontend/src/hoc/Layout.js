import React, { useState, useEffect } from 'react';
import Header from '../components/views/Header/Header';
import Footer from '../components/views/Footer/Footer';
import styled from 'styled-components';
import { Divider } from 'antd';
const HeaderDiv = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
  transition: background-color 0.3s ease-in-out;
  
  &.scrolled {
    background-color: rgba(255, 255, 255, 1);
  }
`;

const Main = styled.main`
  opacity: 1;
  transition: opacity 0.5s ease-in-out;

  &.show {
    opacity: 1;
  }
`;



const CustomDivider = styled(Divider)`
  position: relative;
  
  left: 50%;
  transform: translateX(-50%);
    width: 98.91vw;
    border-width: 1.5px;
    border-color: #c2c3cd;
    opacity: 1;
  transition: opacity 0.5s ease-in-out;
 background-color: white;
  &.show {
    opacity: 0.01;
  }
`;

const FooterDiv = styled.div`
 
  background-color: #424242;
`;

const ContainerDiv = styled.div`
  width: 1000px;
  margin-left: auto;
  margin-right: auto;
  background-color: aliceblue;
`;


export default function Layout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isScrolled && !showContent) {
      setShowContent(true);
    } else if (!isScrolled && showContent) {
      setShowContent(false);
    }
  }, [isScrolled, showContent]);

  return (
    <div>
    <ContainerDiv>
      <HeaderDiv className={isScrolled ? 'scrolled' : ''}>
        <Header /> {/* 공통 헤더 컴포넌트 */}
        
  <CustomDivider className={showContent ?''  : 'show'}></CustomDivider>
      </HeaderDiv>
      
      <Main className={showContent ?''  : 'show'}>{children}</Main> {/* 페이지 컨텐츠 */}
 
     
    </ContainerDiv>
    
    <FooterDiv>
    <ContainerDiv>
      <Footer /> {/* 공통 푸터 컴포넌트 */}
      </ContainerDiv>
      </FooterDiv>
      
    </div>
  );
}
