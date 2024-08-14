import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({theme})=>theme.bg};
  border-top: 0.5px solid ${({theme})=>theme.bgLight};
  color: #eee;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const FooterBottom = styled.div`
  text-align: center;
  font-size: 12px;
  color: #777;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrapper> 
      </FooterWrapper>
      <FooterBottom>&copy; 2024 InTalks. All rights reserved.</FooterBottom>
      <FooterBottom>Designed by AMEY BANGDE.</FooterBottom>
    </FooterContainer>
  );
};

export default Footer;



