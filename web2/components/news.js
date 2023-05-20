import styled from '@emotion/styled';
import React from 'react';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f5f5 0%, #ddd 100%);
  border-bottom: 5px solid #333;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: start;
  }
`;

const Title = styled.h1`
  font-size: 2.5em;
  font-weight: 900;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #333, transparent);
  }
`;

const Date = styled.p`
  font-size: 1em;
  color: #666;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top: -10px;
    right: -10px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #333;
    animation: pulse 2s infinite;
  }
  @media (max-width: 768px) {
    margin-top: 10px;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(51, 51, 51, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(51, 51, 51, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(51, 51, 51, 0);
    }
  }
`;

const NewsPostHeader = ({ title, date }) => (
  <Header>
    <Title>{title}</Title>
    <Date>{date}</Date>
  </Header>
);

export default NewsPostHeader;