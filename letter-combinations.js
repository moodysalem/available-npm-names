const _ = require('underscore');

module.exports = {
  alphabet: _.chain(_.range(65, 65 + 26)).map(i => String.fromCharCode(i)).value(),

  combinations: (letters, length, str = '') => {
    if (length === 0) {
      return [ str ];
    }
    if (length === 1) {
      return _.map(letters, l => `${str}${l}`);
    }

    return _.flatten(
      _.map(
        letters,
        l => combinations(letters, length - 1, `${str}${l}`)
      )
    );
  }
};