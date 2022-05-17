import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import logger from '/imports/startup/client/logger';
import Styled from './styles';
import EmojiPicker from '/imports/ui/components/emoji-picker/component';

const EMOJI_BUTTON = Meteor.settings.public.app.enableEmojiButton;

const propTypes = {
  placeholder: PropTypes.string,
  send: PropTypes.func.isRequired,
  emojiPickerDown: PropTypes.bool,
};

const defaultProps = {
  placeholder: '',
  send: () => logger.warn({ logCode: 'text_input_send_function' }, `Missing`),
  emojiPickerDown: false,
};

const messages = defineMessages({
  sendLabel: {
    id: 'app.textInput.sendLabel',
    description: 'Text input send button label',
  },
});

class TextInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      showEmojiPicker: false
    };
  }

  handleOnChange(e) {
    const message = e.target.value;
    this.setState({ message });
  }

  handleOnKeyDown(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.handleOnClick();
    }
  }

  handleOnClick() {
    const { send } = this.props;
    const { message } = this.state;

    send(message);
    this.setState({
      message: '',
      showEmojiPicker: false,
    });
  }

  handleMessageKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleOnClick();
    }
  }

  handleEmojiSelect(emojiObject) {
    const { message } = this.state;
    this.setState({ message: message + emojiObject.native });
  }

  emojiEnabled() {
    return EMOJI_BUTTON && !this.mobile;
  }

  renderEmojiPicker() {
    const { showEmojiPicker } = this.state;

    if (showEmojiPicker) {
      return (
        <EmojiPicker
          onEmojiSelect={emojiObject => this.handleEmojiSelect(emojiObject)}
        />
      );
    }
    return null;
  }

  render() {
    const {
      intl,
      maxLength,
      placeholder,
      emojiPickerDown,
    } = this.props;

    const { message } = this.state;

    return (
      <>
        <Styled.Wrapper>
          <Styled.EmojiButtonIcon
            iconName="happy"
          />
          <Styled.TextArea
            maxLength={maxLength}
            onChange={(e) => this.handleOnChange(e)}
            onKeyDown={(e) => this.handleOnKeyDown(e)}
            placeholder={placeholder}
            value={message}
          />
          <Styled.TextInputButton
            circle
            color="primary"
            hideLabel
            icon="send"
            label={intl.formatMessage(messages.sendLabel)}
            onClick={() => this.handleOnClick()}
          />
        </Styled.Wrapper>
      </>
    );
  }
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

export default injectIntl(TextInput);
