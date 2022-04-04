import styled, { keyframes } from 'styled-components';
import { colorPrimary, colorWhite } from '/imports/ui/stylesheets/styled-components/palette';

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

  ${({ color }) => color && `
  background-color: ${color};
  `}
`;

const UserImage = styled.img`
  border-radius: 100%;
  height: 60%;
  width: 45%;
  object-fit: cover;
  border: 5px solid black;
  position: absolute;
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 2s linear infinite;
  transform: translateZ(0);

  border-top: 6px solid black;
  border-right: 6px solid black;
  border-bottom: 6px solid black;
  border-left: 6px solid ${colorPrimary};
  background: transparent;
  width: 47%;
  height: 63%;
  border-radius: 50%;
`;

export default {
  Name,
  NameWrapper,
  UserColor,
  Spinner,
  UserImage,
};
