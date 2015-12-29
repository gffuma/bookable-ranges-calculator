var moment = require('moment');
var util = require('./util.js');
var calculateRanges = require('./../lib/bookable-ranges-calculator.js');

var bookableRanges = calculateRanges({

  // Period used to looking for bookable ranges of time
  period: {
    start: moment('2015-12-11'),
    end: moment('2016-01-06')
  },

  // The duration of range to booking
  bookingDuration: moment.duration(1, 'hours'),

  // Map workign hours, key is intended to day of week
  // Sunday as 0 and Saturday as 6
  weekWorkingHours: {
    // Monday
    1: [
      {
        start: moment('09:00', 'HH:mm'),
        end: moment('12:00', 'HH:mm')
      },
      {
        start: moment('14:00', 'HH:mm'),
        end: moment('18:00', 'HH:mm')
      }
    ]
  }

});

// Log result
bookableRanges.map(util.logBookableRange);
