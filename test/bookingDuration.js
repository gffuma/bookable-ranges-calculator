var calculateRanges = require('./../lib/bookable-ranges-calculator');
var moment = require('moment');
var assert = require('assert');
var r = require('./shared/range').range;
var hr = require('./shared/range').hourRange;
var eq = require('./shared/eq').rangesEquals;

describe('Booking duration', function() {

  it('only hours', function() {
    var bookableRanges = calculateRanges({
      period: r('2015-12-14', '2015-12-21'),
      bookingDuration: moment.duration(1, 'hours'),
      weekWorkingHours: {
        0: [hr('09:00', '12:00')],
        1: [hr('09:00', '12:00')],
        2: [hr('09:00', '12:00')],
        3: [hr('09:00', '12:00')],
        4: [hr('09:00', '12:00')],
        5: [hr('09:00', '12:00')],
        6: [hr('09:00', '12:00')]
      }
    });
    eq(bookableRanges, [
      r('2015-12-14 09:00:00', '2015-12-14 10:00:00'),
      r('2015-12-14 10:00:00', '2015-12-14 11:00:00'),
      r('2015-12-14 11:00:00', '2015-12-14 12:00:00'),

      r('2015-12-15 09:00:00', '2015-12-15 10:00:00'),
      r('2015-12-15 10:00:00', '2015-12-15 11:00:00'),
      r('2015-12-15 11:00:00', '2015-12-15 12:00:00'),

      r('2015-12-16 09:00:00', '2015-12-16 10:00:00'),
      r('2015-12-16 10:00:00', '2015-12-16 11:00:00'),
      r('2015-12-16 11:00:00', '2015-12-16 12:00:00'),

      r('2015-12-17 09:00:00', '2015-12-17 10:00:00'),
      r('2015-12-17 10:00:00', '2015-12-17 11:00:00'),
      r('2015-12-17 11:00:00', '2015-12-17 12:00:00'),

      r('2015-12-18 09:00:00', '2015-12-18 10:00:00'),
      r('2015-12-18 10:00:00', '2015-12-18 11:00:00'),
      r('2015-12-18 11:00:00', '2015-12-18 12:00:00'),

      r('2015-12-19 09:00:00', '2015-12-19 10:00:00'),
      r('2015-12-19 10:00:00', '2015-12-19 11:00:00'),
      r('2015-12-19 11:00:00', '2015-12-19 12:00:00'),

      r('2015-12-20 09:00:00', '2015-12-20 10:00:00'),
      r('2015-12-20 10:00:00', '2015-12-20 11:00:00'),
      r('2015-12-20 11:00:00', '2015-12-20 12:00:00')
    ]);
  });

  it('minutes', function() {
    var bookableRanges = calculateRanges({
      period: r('2015-12-14', '2015-12-21'),
      bookingDuration: moment.duration(33, 'minutes'),
      weekWorkingHours: {
        1: [hr('09:00', '12:00')],
        2: [hr('09:00', '12:00')]
      }
    });
    eq(bookableRanges, [
      r('2015-12-14 09:00:00', '2015-12-14 09:33:00'),
      r('2015-12-14 09:33:00', '2015-12-14 10:06:00'),
      r('2015-12-14 10:06:00', '2015-12-14 10:39:00'),
      r('2015-12-14 10:39:00', '2015-12-14 11:12:00'),
      r('2015-12-14 11:12:00', '2015-12-14 11:45:00'),

      r('2015-12-15 09:00:00', '2015-12-15 09:33:00'),
      r('2015-12-15 09:33:00', '2015-12-15 10:06:00'),
      r('2015-12-15 10:06:00', '2015-12-15 10:39:00'),
      r('2015-12-15 10:39:00', '2015-12-15 11:12:00'),
      r('2015-12-15 11:12:00', '2015-12-15 11:45:00')
    ]);
  });

});