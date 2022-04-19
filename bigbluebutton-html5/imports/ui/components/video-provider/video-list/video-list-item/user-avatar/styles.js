import styled from 'styled-components';
import { colorOffWhite, colorWhite } from '/imports/ui/stylesheets/styled-components/palette';
import { TextElipsis } from '/imports/ui/stylesheets/styled-components/placeholders';

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

  ${({ isModerator }) => isModerator && `
  border-radius: 5%;
  `}
`;

const UserImage = styled.img`
  border-radius: 100%;
  height: 60%;
  width: 45%;
  object-fit: cover;
  position: absolute;
`;

const UserName = styled(TextElipsis)`
  position: absolute;
  bottom: 7px;
  left: 7px;
  max-width: 75%;
  // Keep the background with 0.5 opacity, but leave the text with 1
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1px;
  color: ${colorOffWhite};
  padding: 0 .5rem 0 .5rem;
  font-size: 80%;
`;

export default {
  Name,
  NameWrapper,
  UserColor,
  UserName,
  UserImage,
};
