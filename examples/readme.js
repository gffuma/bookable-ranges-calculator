var moment = require('moment');
var util = require('./util');
var calculateRanges = require('./../lib/bookable-ranges-calculator');

var bookableRanges = calculateRanges({

  // Period of calculation
  period: {
    start: moment('2015-12-11'),
    end: moment('2016-01-02')
  },

  // The duration of range to booking
  bookingDuration: moment.duration(1, 'hours'),

  // Map workign hours, key is intended as day of week
  // Sunday as 0 and Saturday as 6
  weekWorkingHours: {
    // Monday
    1: [
      {
        start: moment('09:00', 'HH:mm'),
        end: moment('12:00', 'HH:mm')
      },
      {
        start: moment('16:00', 'HH:mm'),
        end: moment('18:00', 'HH:mm')
      }
    ]
  },

  // List of workstation id
  workstationIds: [1, 2],

  // List of bookings
  bookings: [
    {
      start: moment('2015-12-14 09:00'),
      end: moment('2015-12-14 10:30'),
      workstationId: 1
    },
    {
      start: moment('2015-12-28 17:00'),
      end: moment('2016-12-18 18:00'),
      workstationId: 2
    },
    {
      start: moment('2015-12-28 16:00'),
      end: moment('2016-12-18 18:00'),
      workstationId: 1
    }
  ]

});

// Log result
bookableRanges.map(util.logBookableRange);
