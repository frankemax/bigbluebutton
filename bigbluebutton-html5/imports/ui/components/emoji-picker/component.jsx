//emoji-mart docs: https://github.com/missive/emoji-mart

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

const propTypes = {
  intl: intlShape.isRequired,
  onEmojiSelect: PropTypes.func.isRequired,
};

const emojisToExclude = [
  "2640-FE0F",
  "2642-FE0F",
  "2695-FE0F",
]

function EmojiPicker(props) {
  const {
    intl,
    onEmojiSelect,
  } = props;

  const i18n = {
    search: intl.formatMessage({ id: "app.emojiPicker.search" }),
    notfound: intl.formatMessage({ id: "app.emojiPicker.notFound" }),
    clear: intl.formatMessage({ id: "app.emojiPicker.clear" }),
    skintext: intl.formatMessage({ id: "app.emojiPicker.skintext" }),
    categories: {
      people: intl.formatMessage({ id: "app.emojiPicker.categories.people" }),
      nature: intl.formatMessage({ id: "app.emojiPicker.categories.nature" }),
      foods: intl.formatMessage({ id: "app.emojiPicker.categories.foods" }),
      places: intl.formatMessage({ id: "app.emojiPicker.categories.places" }),
      activity: intl.formatMessage({ id: "app.emojiPicker.categories.activity" }),
      objects: intl.formatMessage({ id: "app.emojiPicker.categories.objects" }),
      symbols: intl.formatMessage({ id: "app.emojiPicker.categories.symbols" }),
      flags: intl.formatMessage({ id: "app.emojiPicker.categories.flags" }),
      recent: intl.formatMessage({ id: "app.emojiPicker.categories.recent" }),
      search: intl.formatMessage({ id: "app.emojiPicker.categories.search" }),
    },
    categorieslabel: intl.formatMessage({ id: "app.emojiPicker.categories.label" }),
    skintones: {
      1: intl.formatMessage({ id: "app.emojiPicker.skintones.1" }),
      2: intl.formatMessage({ id: "app.emojiPicker.skintones.2" }),
      3: intl.formatMessage({ id: "app.emojiPicker.skintones.3" }),
      4: intl.formatMessage({ id: "app.emojiPicker.skintones.4" }),
      5: intl.formatMessage({ id: "app.emojiPicker.skintones.5" }),
      6: intl.formatMessage({ id: "app.emojiPicker.skintones.6" }),
    }
  };

  return (
    <Picker
      onSelect={(emojiObject, event) => onEmojiSelect(emojiObject, event)}
      native={true}
      emoji=""
      title=""
      emojiSize={20}
      emojiTooltip={true}
      i18n={i18n}
      emojisToShowFilter={emojiObject => !emojisToExclude.some(code => code === emojiObject.unified)}
    />
  );
}

EmojiPicker.propTypes = propTypes;

export default injectIntl(EmojiPicker);