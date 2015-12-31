Bookable Ranges Calculator JS
=============================

[![Build Status](https://travis-ci.org/gffuma/bookable-ranges-calculator.svg?branch=master)](https://travis-ci.org/gffuma/bookable-ranges-calculator)

Bookable ranges calculator in λ way using moment and Ramda.

Calculate free ranges of times from a given period, the duration of calculated ranges, list of bookings, different workstations and other parameters that determine available time. Use moment js as time data.

Quick Example
============

```js
var calculateRanges = require('bookable-ranges-calculator');
calculateRanges({

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

```
Here the result:
```js
[
  {
    start: moment('2015-12-14 09:00:00'),
    end: moment('2015-12-14 10:00:00'),
    workstationIds: [2]
  },
  {
    start: moment('2015-12-14 10:00:00'),
    end: moment('2015-12-14 11:00:00'),
    workstationIds: [2]
  },
  {
    start: moment('2015-12-14 10:30:00'),
    end: moment('2015-12-14 11:30:00'),
    workstationIds: [1]
  },
  {
    start: moment('2015-12-14 11:00:00'),
    end: moment('2015-12-14 12:00:00'),
    workstationIds: [2]
  },
  {
    start: moment('2015-12-14 16:00:00'),
    end: moment('2015-12-14 17:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-14 17:00:00'),
    end: moment('2015-12-14 18:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-21 09:00:00'),
    end: moment('2015-12-21 10:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-21 10:00:00'),
    end: moment('2015-12-21 11:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-21 11:00:00'),
    end: moment('2015-12-21 12:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-21 16:00:00'),
    end: moment('2015-12-21 17:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-21 17:00:00'),
    end: moment('2015-12-21 18:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-28 09:00:00'),
    end: moment('2015-12-28 10:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-28 10:00:00'),
    end: moment('2015-12-28 11:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-28 11:00:00'),
    end: moment('2015-12-28 12:00:00'),
    workstationIds: [1, 2]
  },
  {
    start: moment('2015-12-28 16:00:00'),
    end: moment('2015-12-28 17:00:00'),
    workstationIds: [2]
  }
]
```

Available Options
=================
 * **period**: ```{ start: moment(), end: moment() }``` The period of booking.
 * **bookingDuration**: ```moment.duration``` The duration of booked range.
 * **paddingDuration**: ```moment.duration``` The interval between a bookable range and other and between range and booking.
 * **bookings**: ```[{start: moment(), end: moment()}, workstationId: Number]```
  List of bookings, if ```workstationIds``` is present every booking must have a ```workstationId``` field.
 * **workstationIds**: ```[Number]``` All workstation available for booking.
 * **weekWorkingHours**: ```{ dayOfWeek: [{ start: moment(), end: moment() }] }```
 Normal week working hours, ```dayOfWeek``` use moment standard so Sunday as 0 and Saturday as 6.
 * **specialWorkingHours**: ```{ date: [{ start: moment(), end: moment() }] }```
 Special working hours (overwrite ```weekWorkingHours``` and ```fixedClosingDays```), date is a string in the format YYYY-MM-DD.
 * **fixedClosingDays**: ```[moment]``` all days to excluded from calculation (year ignored).
 * **specialClosingDays**: ```[moment]``` all dates to exclude from calculate.
