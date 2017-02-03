#! /usr/local/bin/node
const _ = require('underscore');
const npmName = require('npm-name');

const MAX_QUEUED = 3;

module.exports = words => {
  let available = [],
    queued = 0;

  return new Promise(
    resolve => {
      const copy = [].concat(words);

      const test100 = () => {
        if (copy.length === 0) {
          return;
        }

        if (queued > MAX_QUEUED) {
          setTimeout(test100, 100);
          return;
        }

        const split = copy.splice(0, Math.min(copy.length, 100));

        console.log(`testing another 100... ${copy.length} remaining`);

        queued += 1;
        npmName
          .many(split)
          .then(
            result => {
              available = available.concat(
                _.filter(
                  split,
                  comb => result.get(comb)
                )
              );
              queued -= 1;

              console.log(`found ${available.length} [${split[ 0 ]},${split[ split.length - 1 ]}], queued: ${queued}`);

              if (queued === 0 && copy.length === 0) {
                resolve(available);
              }
            }
          );
        setTimeout(test100, 100);
      };

      test100();
    }
  );
};