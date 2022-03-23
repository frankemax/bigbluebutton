import styled from 'styled-components';
import Icon from '/imports/ui/components/common/icon/component';
import { audioIndicatorFs, audioIndicatorWidth } from '/imports/ui/stylesheets/styled-components/general';
import { colorDanger, colorSuccess, colorWhite } from '/imports/ui/stylesheets/styled-components/palette';

const Voice = styled(Icon)`
  display: inline-block;
  position: absolute;
  right: 7px;
  bottom: 6px;
  width: ${audioIndicatorWidth};
  height: ${audioIndicatorWidth};
  min-width: ${audioIndicatorWidth};
  min-height: ${audioIndicatorWidth};
  color: ${colorWhite};
  border-radius: 50%;

  &::before {
    font-size: ${audioIndicatorFs};
  }

  background-color: ${colorSuccess};
`;

const Muted = styled(Icon)`
  display: inline-block;
  position: absolute;
  right: 7px;
  bottom: 6px;
  width: ${audioIndicatorWidth};
  height: ${audioIndicatorWidth};
  min-width: ${audioIndicatorWidth};
  min-height: ${audioIndicatorWidth};
  color: ${colorWhite};
  border-radius: 50%;

  &::before {
    font-size: ${audioIndicatorFs};
  }

  background-color: ${colorDanger};
`;

export default {
  Voice,
  Muted,
};
