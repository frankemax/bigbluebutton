import React from 'react';
import PropTypes from 'prop-types';
import Styled from './styles';

const UserAvatar = (props) => {
  const { user } = props;

  const { name } = user;
  const { color } = user;
  const { avatar } = user;

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
          >
            <Styled.NameWrapper>
              <Styled.Name>{name}</Styled.Name>
            </Styled.NameWrapper>
          </Styled.UserColor>
        )}
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
  }).isRequired,
};
