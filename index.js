const THREE_LETTER_WORDS = require('./three-letter-words');
const testWords = require('./test-words');

testWords(THREE_LETTER_WORDS)
  .then(
    words => console.log(words.join('\n'))
  );