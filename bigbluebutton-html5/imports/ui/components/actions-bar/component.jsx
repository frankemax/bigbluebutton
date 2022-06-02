import React, { PureComponent } from 'react';
import deviceInfo from '/imports/utils/deviceInfo';
import CaptionsButtonContainer from '/imports/ui/components/captions/button/container';
import withShortcutHelper from '/imports/ui/components/shortcut-help/service';
import Styled from './styles';
import ActionsDropdown from './actions-dropdown/container';
import ScreenshareButtonContainer from '/imports/ui/components/actions-bar/screenshare/container';
import AudioControlsContainer from '../audio/audio-controls/container';
import JoinVideoOptionsContainer from '../video-provider/video-button/container';
import PresentationOptionsContainer from './presentation-options/component';

class ActionsBar extends PureComponent {
  render() {
    const {
      amIPresenter,
      amIModerator,
      enableVideo,
      presentationIsOpen,
      setPresentationIsOpen,
      handleTakePresenter,
      intl,
      isSharingVideo,
      hasScreenshare,
      stopExternalVideoShare,
      isCaptionsAvailable,
      isMeteorConnected,
      isPollingEnabled,
      isSelectRandomUserEnabled,
      isRaiseHandButtonEnabled,
      isThereCurrentPresentation,
      allowExternalVideo,
      setEmojiStatus,
      currentUser,
      shortcuts,
      layoutContextDispatch,
      actionsBarStyle,
      setMeetingLayout,
      showPushLayout,
    } = this.props;

    if (deviceInfo.isMobile) {
      return (
        <Styled.MobileActionsBarContainer>
          <ActionsDropdown {...{
            amIPresenter,
            amIModerator,
            isPollingEnabled,
            isSelectRandomUserEnabled,
            allowExternalVideo,
            handleTakePresenter,
            intl,
            isSharingVideo,
            stopExternalVideoShare,
            isMeteorConnected,
            setMeetingLayout,
            presentationIsOpen,
            showPushLayout,
          }}
          />
          {isCaptionsAvailable && <CaptionsButtonContainer {...{ intl }} />}
          <AudioControlsContainer />
          {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}
          <PresentationOptionsContainer
            presentationIsOpen={presentationIsOpen}
            setPresentationIsOpen={setPresentationIsOpen}
            layoutContextDispatch={layoutContextDispatch}
            hasPresentation={isThereCurrentPresentation}
            hasExternalVideo={isSharingVideo}
            hasScreenshare={hasScreenshare}
          />
          {isRaiseHandButtonEnabled
            ? (
              <Styled.RaiseHandButton
                icon="hand"
                label={intl.formatMessage({
                  id: `app.actionsBar.emojiMenu.${
                    currentUser.emoji === 'raiseHand'
                      ? 'lowerHandLabel'
                      : 'raiseHandLabel'
                  }`,
                })}
                accessKey={shortcuts.raisehand}
                color={currentUser.emoji === 'raiseHand' ? 'primary' : 'default'}
                data-test={currentUser.emoji === 'raiseHand' ? 'lowerHandLabel' : 'raiseHandLabel'}
                ghost={currentUser.emoji !== 'raiseHand'}
                emoji={currentUser.emoji}
                hideLabel
                circle
                size="lg"
                onClick={() => {
                  setEmojiStatus(
                    currentUser.userId,
                    currentUser.emoji === 'raiseHand' ? 'none' : 'raiseHand',
                  );
                }}
              />
            )
            : null}
        </Styled.MobileActionsBarContainer>
      );
    }

    return (
      <Styled.ActionsBar
        style={
          {
            height: actionsBarStyle.innerHeight,
          }
        }
      >
        <Styled.Left>
          <ActionsDropdown {...{
            amIPresenter,
            amIModerator,
            isPollingEnabled,
            isSelectRandomUserEnabled,
            allowExternalVideo,
            handleTakePresenter,
            intl,
            isSharingVideo,
            stopExternalVideoShare,
            isMeteorConnected,
            setMeetingLayout,
            presentationIsOpen,
            showPushLayout,
          }}
          />
          {isCaptionsAvailable
            ? (
              <CaptionsButtonContainer {...{ intl }} />
            )
            : null}
        </Styled.Left>
        <Styled.Center>
          <AudioControlsContainer />
          {enableVideo
            ? (
              <JoinVideoOptionsContainer />
            )
            : null}
          <ScreenshareButtonContainer {...{
            amIPresenter,
            isMeteorConnected,
          }}
          />
        </Styled.Center>
        <Styled.Right>
          <PresentationOptionsContainer
            presentationIsOpen={presentationIsOpen}
            setPresentationIsOpen={setPresentationIsOpen}
            layoutContextDispatch={layoutContextDispatch}
            hasPresentation={isThereCurrentPresentation}
            hasExternalVideo={isSharingVideo}
            hasScreenshare={hasScreenshare}
          />
          {isRaiseHandButtonEnabled
            ? (
              <Styled.RaiseHandButton
                icon="hand"
                label={intl.formatMessage({
                  id: `app.actionsBar.emojiMenu.${
                    currentUser.emoji === 'raiseHand'
                      ? 'lowerHandLabel'
                      : 'raiseHandLabel'
                  }`,
                })}
                accessKey={shortcuts.raisehand}
                color={currentUser.emoji === 'raiseHand' ? 'primary' : 'default'}
                data-test={currentUser.emoji === 'raiseHand' ? 'lowerHandLabel' : 'raiseHandLabel'}
                ghost={currentUser.emoji !== 'raiseHand'}
                emoji={currentUser.emoji}
                hideLabel
                circle
                size="lg"
                onClick={() => {
                  setEmojiStatus(
                    currentUser.userId,
                    currentUser.emoji === 'raiseHand' ? 'none' : 'raiseHand',
                  );
                }}
              />
            )
            : null}
        </Styled.Right>
      </Styled.ActionsBar>
    );
  }
}

export default withShortcutHelper(ActionsBar, ['raiseHand']);
