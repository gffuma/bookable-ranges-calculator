var calculateRanges = require('./../lib/bookable-ranges-calculator');
var moment = require('moment');
var assert = require('assert');
var r = require('./shared/range').range;

describe('Period', function() {

  it('empty bookable ranges when only period and bookingDuration given', function() {
    var bookableRanges = calculateRanges({
      period: r('2015-12-13', '2016-12-20'),
      bookingDuration: moment.duration(10, 'minutes')
    });
    assert.strictEqual(bookableRanges.length, 0);
  });

});
