#! /usr/local/bin/node
const _ = require('underscore');
const npmName = require('npm-name');

const letters = _.chain(_.range(65, 65 + 26)).map(i => String.fromCharCode(i)).value();

const combinations = (letters, length, str = '') => {
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
};

let combs = combinations(letters, 3);

const MAX_QUEUED = 3;

let available = [],
  queued = 0;

const test100 = () => {
  if (combs.length === 0) {
    return;
  }

  if (queued > MAX_QUEUED) {
    setTimeout(test100, 100);
    return;
  }

  const split = combs.splice(0, Math.min(combs.length, 100));

  console.log(`testing another 100... ${combs.length} remaining`);

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

        if (queued === 0 && combs.length === 0) {
          console.log(available.join('\n'));
        }
      }
    );
  setTimeout(test100, 100);
};

test100();
