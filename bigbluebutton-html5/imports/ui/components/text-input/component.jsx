import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import logger from '/imports/startup/client/logger';
import Icon from '/imports/ui/components/icon/component';
import EmojiPicker from '/imports/ui/components/emoji-picker/component';
import Styled from './styles';

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

  renderEmojiPicker() {
    const { showEmojiPicker } = this.state;
    const { mobile } = browser();

    if (!mobile && showEmojiPicker) {
      return (
        <EmojiPicker
          onEmojiSelect={emojiObject => this.handleEmojiSelect(emojiObject)}
        />
      );
    }
    return null;
  }

  renderEmojiButton = () => {
    const { showEmojiPicker } = this.state;

    return (
      <div
        className={styles.emojiButtonWrapper}
        onClick={() => { this.setState({ showEmojiPicker: !showEmojiPicker }) }}
      >
        <Icon
          iconName="happy"
        />
      </div>
    );
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
        {!emojiPickerDown ? this.renderEmojiPicker() : null}
        <Styled.Wrapper>
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
        {emojiPickerDown ? this.renderEmojiPicker() : null}
      </>
    );
  }
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

export default injectIntl(TextInput);
