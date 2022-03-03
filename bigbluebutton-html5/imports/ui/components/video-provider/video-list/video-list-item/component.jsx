import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import browserInfo from '/imports/utils/browserInfo';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import BBBMenu from '/imports/ui/components/common/menu/component';
import FullscreenService from '/imports/ui/components/common/fullscreen-button/service';
import FullscreenButtonContainer from '/imports/ui/components/common/fullscreen-button/container';
import Styled from './styles';
import VideoService from '../../service';
import {
  isStreamStateUnhealthy,
  subscribeToStreamStateChange,
  unsubscribeFromStreamStateChange,
} from '/imports/ui/services/bbb-webrtc-sfu/stream-state-service';
import { ACTIONS } from '/imports/ui/components/layout/enums';
import Settings from '/imports/ui/services/settings';

const ALLOW_FULLSCREEN = Meteor.settings.public.app.allowFullscreen;
const { isSafari } = browserInfo;
const FULLSCREEN_CHANGE_EVENT = isSafari ? 'webkitfullscreenchange' : 'fullscreenchange';

const intlMessages = defineMessages({
  focusLabel: {
    id: 'app.videoDock.webcamFocusLabel',
  },
  focusDesc: {
    id: 'app.videoDock.webcamFocusDesc',
  },
  unfocusLabel: {
    id: 'app.videoDock.webcamUnfocusLabel',
  },
  unfocusDesc: {
    id: 'app.videoDock.webcamUnfocusDesc',
  },
  pinLabel: {
    id: 'app.videoDock.webcamPinLabel',
  },
  pinDesc: {
    id: 'app.videoDock.webcamPinDesc',
  },
  unpinLabel: {
    id: 'app.videoDock.webcamUnpinLabel',
  },
  unpinLabelDisabled: {
    id: 'app.videoDock.webcamUnpinLabelDisabled',
  },
  unpinDesc: {
    id: 'app.videoDock.webcamUnpinDesc',
  },
  mirrorLabel: {
    id: 'app.videoDock.webcamMirrorLabel',
  },
  mirrorDesc: {
    id: 'app.videoDock.webcamMirrorDesc',
  },
});

const VideoListItem = (props) => {
  const [videoIsReady, setVideoIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isStreamHealthy, setIsStreamHealthy] = useState(false);
  const [isMirrored, setIsMirrored] = useState(VideoService.mirrorOwnWebcam(props.userId));
  const videoTag = useRef();
  const videoContainer = useRef();
  const mirrorOwnWebcam = VideoService.mirrorOwnWebcam(props.userId);

  useEffect(() => {
    const { onVideoItemMount, cameraId } = props;
    onVideoItemMount(videoTag.current);
    subscribeToStreamStateChange(cameraId, onStreamStateChange);
    videoTag.current.addEventListener('loadeddata', handleSetVideoIsReady);
    videoContainer.current.addEventListener(FULLSCREEN_CHANGE_EVENT, onFullscreenChange);

    return () => {
      videoTag.current.removeEventListener('loadeddata', handleSetVideoIsReady);
      videoContainer.current.removeEventListener(FULLSCREEN_CHANGE_EVENT, onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const playElement = (elem) => {
      if (elem.paused) {
        elem.play().catch((error) => {
          // NotAllowedError equals autoplay issues, fire autoplay handling event
          if (error.name === 'NotAllowedError') {
            const tagFailedEvent = new CustomEvent('videoPlayFailed', { detail: { mediaTag: elem } });
            window.dispatchEvent(tagFailedEvent);
          }
        });
      }
    };

    // This is here to prevent the videos from freezing when they're
    // moved around the dom by react, e.g., when  changing the user status
    // see https://bugs.chromium.org/p/chromium/issues/detail?id=382879
    if (videoIsReady) {
      playElement(videoTag.current);
    }
  }, [videoIsReady]);

  useEffect(() => () => {
    const {
      cameraId,
      onVideoItemUnmount,
      isFullscreenContext,
      layoutContextDispatch,
    } = props;

    unsubscribeFromStreamStateChange(cameraId, onStreamStateChange);
    onVideoItemUnmount(cameraId);

    if (isFullscreenContext) {
      layoutContextDispatch({
        type: ACTIONS.SET_FULLSCREEN_ELEMENT,
        value: {
          element: '',
          group: '',
        },
      });
    }
  }, []);

  const onStreamStateChange = (e) => {
    const { streamState } = e.detail;

    const newHealthState = !isStreamStateUnhealthy(streamState);
    e.stopPropagation();

    if (newHealthState !== isStreamHealthy) {
      setIsStreamHealthy(newHealthState);
    }
  };

  const onFullscreenChange = () => {
    const serviceIsFullscreen = FullscreenService.isFullScreen(videoContainer);

    if (isFullscreen !== serviceIsFullscreen) {
      setIsFullscreen(serviceIsFullscreen);
    }
  };

  const handleSetVideoIsReady = () => {
    setVideoIsReady(true);
    window.dispatchEvent(new Event('resize'));

    /* used when re-sharing cameras after leaving a breakout room.
    it is needed in cases where the user has more than one active camera
    so we only share the second camera after the first
    has finished loading (can't share more than one at the same time) */
    Session.set('canConnect', true);
  };

  const getAvailableActions = () => {
    const {
      intl,
      cameraId,
      numOfStreams,
      onHandleVideoFocus,
      user,
      focused,
    } = props;

    const pinned = user?.pin;
    const userId = user?.userId;

    const isPinnedIntlKey = !pinned ? 'pin' : 'unpin';
    const isFocusedIntlKey = !focused ? 'focus' : 'unfocus';

    const menuItems = [{
      key: `${cameraId}-mirror`,
      label: intl.formatMessage(intlMessages.mirrorLabel),
      description: intl.formatMessage(intlMessages.mirrorDesc),
      onClick: () => mirrorCamera(cameraId),
    }];

    if (numOfStreams > 2) {
      menuItems.push({
        key: `${cameraId}-focus`,
        label: intl.formatMessage(intlMessages[`${isFocusedIntlKey}Label`]),
        description: intl.formatMessage(intlMessages[`${isFocusedIntlKey}Desc`]),
        onClick: () => onHandleVideoFocus(cameraId),
      });
    }

    if (VideoService.isVideoPinEnabledForCurrentUser()) {
      menuItems.push({
        key: `${cameraId}-pin`,
        label: intl.formatMessage(intlMessages[`${isPinnedIntlKey}Label`]),
        description: intl.formatMessage(intlMessages[`${isPinnedIntlKey}Desc`]),
        onClick: () => VideoService.toggleVideoPin(userId, pinned),
      });
    }

    return menuItems;
  };

  const mirrorCamera = () => {
    setIsMirrored((value) => !value);
  };

  const renderFullscreenButton = () => {
    const { name, cameraId } = props;

    if (!ALLOW_FULLSCREEN) return null;

    return (
      <FullscreenButtonContainer
        data-test="webcamsFullscreenButton"
        fullscreenRef={videoContainer.current}
        elementName={name}
        elementId={cameraId}
        elementGroup="webcams"
        isFullscreen={isFullscreen}
        dark
      />
    );
  };

  const renderPinButton = () => {
    const { user, intl } = props;
    const pinned = user?.pin;
    const userId = user?.userId;
    const shouldRenderPinButton = pinned && userId;
    const videoPinActionAvailable = VideoService.isVideoPinEnabledForCurrentUser();

    if (!shouldRenderPinButton) return null;

    return (
      <Styled.PinButtonWrapper>
        <Styled.PinButton
          color="default"
          icon={!pinned ? 'pin-video_on' : 'pin-video_off'}
          size="sm"
          onClick={() => VideoService.toggleVideoPin(userId, true)}
          label={videoPinActionAvailable
            ? intl.formatMessage(intlMessages.unpinLabel)
            : intl.formatMessage(intlMessages.unpinLabelDisabled)}
          hideLabel
          disabled={!videoPinActionAvailable}
          data-test="pinVideoButton"
        />
      </Styled.PinButtonWrapper>
    );
  };

  const renderComponent = () => {
    const {
      name,
      voiceUser,
      numOfStreams,
      isFullscreenContext,
    } = props;

    const availableActions = getAvailableActions();
    const enableVideoMenu = Meteor.settings.public.kurento.enableVideoMenu || false;
    const shouldRenderReconnect = !isStreamHealthy && videoIsReady;

    const { isFirefox } = browserInfo;
    const { animations } = Settings.application;
    const talking = voiceUser?.talking;
    const listenOnly = voiceUser?.listenOnly;
    const muted = voiceUser?.muted;
    const voiceUserJoined = voiceUser?.joined;

    return (
      <Styled.Content
        talking={talking}
        fullscreen={isFullscreenContext}
        data-test={talking ? 'webcamItemTalkingUser' : 'webcamItem'}
        animations={animations}
      >
        {
          !videoIsReady
          && (
            <Styled.WebcamConnecting
              data-test="webcamConnecting"
              talking={talking}
              animations={animations}
            >
              <Styled.LoadingText>{name}</Styled.LoadingText>
            </Styled.WebcamConnecting>
          )
        }

        {
          shouldRenderReconnect
          && <Styled.Reconnecting />
        }

        <Styled.VideoContainer ref={videoContainer}>
          <Styled.Video
            muted
            data-test={mirrorOwnWebcam ? 'mirroredVideoContainer' : 'videoContainer'}
            mirrored={isMirrored}
            unhealthyStream={shouldRenderReconnect}
            ref={videoTag}
            autoPlay
            playsInline
          />
          {videoIsReady && renderFullscreenButton()}
          {videoIsReady && renderPinButton()}
        </Styled.VideoContainer>
        {videoIsReady
          && (
            <Styled.Info>
              {enableVideoMenu && availableActions.length >= 1
                ? (
                  <BBBMenu
                    trigger={<Styled.DropdownTrigger tabIndex={0} data-test="dropdownWebcamButton">{name}</Styled.DropdownTrigger>}
                    actions={getAvailableActions()}
                    opts={{
                      id: 'default-dropdown-menu',
                      keepMounted: true,
                      transitionDuration: 0,
                      elevation: 3,
                      getContentAnchorEl: null,
                      fullwidth: 'true',
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      transformorigin: { vertical: 'bottom', horizontal: 'left' },
                    }}
                  />
                )
                : (
                  <Styled.Dropdown isFirefox={isFirefox}>
                    <Styled.UserName noMenu={numOfStreams < 3}>
                      {name}
                    </Styled.UserName>
                  </Styled.Dropdown>
                )}
              {muted && !listenOnly ? <Styled.Muted iconName="unmute_filled" /> : null}
              {listenOnly ? <Styled.Voice iconName="listen" /> : null}
              {voiceUserJoined && !muted ? <Styled.Voice iconName="unmute" /> : null}
            </Styled.Info>
          )}
      </Styled.Content>
    );
  };

  return renderComponent();
};

export default injectIntl(VideoListItem);

VideoListItem.defaultProps = {
  numOfStreams: 0,
  user: null,
};

VideoListItem.propTypes = {
  cameraId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  numOfStreams: PropTypes.number,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  onHandleVideoFocus: PropTypes.func.isRequired,
  user: PropTypes.shape({
    pin: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
  voiceUser: PropTypes.shape({
    muted: PropTypes.bool.isRequired,
    listenOnly: PropTypes.bool.isRequired,
    talking: PropTypes.bool.isRequired,
  }).isRequired,
  focused: PropTypes.bool.isRequired,
};
