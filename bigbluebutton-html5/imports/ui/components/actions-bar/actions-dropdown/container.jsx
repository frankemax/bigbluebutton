import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Presentations from '/imports/api/presentations';
import PresentationUploaderService from '/imports/ui/components/presentation/presentation-uploader/service';
import PresentationPodService from '/imports/ui/components/presentation-pod/service';
import ActionsDropdown from './component';
import { layoutSelectInput, layoutDispatch } from '../../layout/context';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { SMALL_VIEWPORT_BREAKPOINT } from '../../layout/enums';
import AppService from "/imports/ui/components/app/service";
import {setUserSelectedListenOnly, setUserSelectedMicrophone} from "/imports/ui/components/audio/audio-modal/service";
import Storage from "/imports/ui/services/storage/session";
import Service from "/imports/ui/components/audio/service";
import logger from "/imports/startup/client/logger";

const ActionsDropdownContainer = (props) => {
  const APP_CONFIG = Meteor.settings.public.app;

  const handleLeaveAudio = () => {
    const meetingIsBreakout = AppService.meetingIsBreakout();

    if (!meetingIsBreakout) {
      setUserSelectedMicrophone(false);
      setUserSelectedListenOnly(false);
    }

    const skipOnFistJoin = getFromUserSettings('bbb_skip_check_audio_on_first_join', APP_CONFIG.skipCheckOnJoin);
    if (skipOnFistJoin && !Storage.getItem('getEchoTest')) {
      Storage.setItem('getEchoTest', true);
    }

    Service.forceExitAudio();
    logger.info({
      logCode: 'audiocontrols_leave_audio',
      extraInfo: { logType: 'user_action' },
    }, 'audio connection closed by user');
  };

  const sidebarContent = layoutSelectInput((i) => i.sidebarContent);
  const sidebarNavigation = layoutSelectInput((i) => i.sidebarNavigation);
  const { width: browserWidth } = layoutSelectInput((i) => i.browser);
  const isMobile = browserWidth <= SMALL_VIEWPORT_BREAKPOINT;
  const layoutContextDispatch = layoutDispatch();

  return (
    <ActionsDropdown {...{
      layoutContextDispatch,
      sidebarContent,
      sidebarNavigation,
      isMobile,
      handleLeaveAudio,
      ...props,
    }}
    />
  );
};

const LAYOUT_CONFIG = Meteor.settings.public.layout;

export default withTracker(() => {
  const presentations = Presentations.find({ 'conversion.done': true }).fetch();
  return ({
    presentations,
    isDropdownOpen: Session.get('dropdownOpen'),
    setPresentation: PresentationUploaderService.setPresentation,
    podIds: PresentationPodService.getPresentationPodIds(),
    hidePresentation: getFromUserSettings('bbb_hide_presentation', LAYOUT_CONFIG.hidePresentation),
  });
})(ActionsDropdownContainer);
