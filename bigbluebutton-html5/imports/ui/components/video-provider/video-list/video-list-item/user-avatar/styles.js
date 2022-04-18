import styled, { keyframes } from 'styled-components';
import { colorWhite } from '/imports/ui/stylesheets/styled-components/palette';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 white;
  }
  70% {
    box-shadow: 0 0 0 0.5625rem transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
`;

const Name = styled.h1`
  text-align: center;
  margin: 0 10%;
  font-size: 100%;
  color: ${colorWhite};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NameWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const UserColor = styled.div`
  border-radius: 100%;
  height: 60%;
  width: 45%;
  position: absolute;
  animation: ${pulse} 1s infinite ease-in;

  ${({ color }) => color && `
  background-color: ${color};
  `}
`;

const UserImage = styled.img`
  border-radius: 100%;
  height: 60%;
  width: 45%;
  object-fit: cover;
  position: absolute;
  animation: ${pulse} 1s infinite ease-in;
`;

export default {
  Name,
  NameWrapper,
  UserColor,
  UserImage,
};
