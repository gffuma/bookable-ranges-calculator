var R = require('ramda');
var assert = require('assert');

// Compare range
var rangeEquals = function(actual, expected) {
  assert.deepEqual(actual.workstationIds, expected.workstationIds);
  assert.strictEqual(true, actual.start.isSame(expected.start));
  assert.strictEqual(true, actual.end.isSame(expected.end));
};

// Compare list of ranges
var rangesEquals = function(actuals, expecteds) {
  assert.strictEqual(actuals.lenght, expecteds.lenght);
  R.map(R.apply(rangeEquals))(R.zip(actuals, expecteds));
};

exports.rangeEquals = rangeEquals;
exports.rangesEquals = rangesEquals;
