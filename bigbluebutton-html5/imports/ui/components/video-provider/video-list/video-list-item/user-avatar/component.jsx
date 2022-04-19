import React from 'react';
import PropTypes from 'prop-types';
import Styled from './styles';

const UserAvatar = (props) => {
  const { user } = props;

  const { name } = user;
  const { color } = user;
  const { avatar } = user;
  const { role } = user;

  const cutName = name.substring(0, 2);
  const isModerator = role === 'MODERATOR';

  return (
    <>
      {avatar !== ''
        ? (
          <Styled.UserImage
            src={avatar}
          />
        )
        : (
          <Styled.UserColor
            color={color}
            isModerator={isModerator}
          >
            <Styled.NameWrapper>
              <Styled.Name>{cutName}</Styled.Name>
            </Styled.NameWrapper>
          </Styled.UserColor>
        )}
      <Styled.UserName>{name}</Styled.UserName>
    </>
  );
};

export default UserAvatar;

UserAvatar.defaultProps = {
};

UserAvatar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};
