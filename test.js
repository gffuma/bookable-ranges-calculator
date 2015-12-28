import moment from 'moment';
import R from 'ramda';
import awesomeStuff from './src/bookable-range-calculator.js';


const impure = {
  logTimeRange (timeRange) {
    console.log('Start:', timeRange.start.format(), 'End:', timeRange.end.format(), 'Workstations:', timeRange.workstationIds);
  }
};
// Data
const period = {
  start: moment('2015-12-06'),
  end: moment('2017-02-09')
};

const bookingDuration = moment.duration(1, 'hours');
const paddingDuration = null;//moment.duration(2, 'minutes');
const fixedClosingDays = [];//[moment('1995-12-07')];
const specialClosingDays = [];
const weekWorkingHours = {
  0: [
    {
      start: moment('09:00', 'HH:mm'),
      end: moment('12:00', 'HH:mm')
    },
    {
      start: moment('15:30', 'HH:mm'),
      end: moment('16:30', 'HH:mm')
    },
    //{
      //start: moment('13:00'),
      //end: moment('17:00')
    //},
    //{
      //start: moment('18:00'),
      //end: moment('20:00')
    //}
  ],
  1: [
    {
      start: moment('09:00', 'HH:mm'),
      end: moment('12:00', 'HH:mm')
    }
  ],
  2: [],
  3: []
};
const bookings = [
  {
      start: moment('2015-12-06 09:30', 'YYYY-MM-DD HH:mm'),
      end: moment('2015-12-06 10:10', 'YYYY-MM-DD HH:mm'),
      workstationId: 3
  },
  //{
      //start: moment('2015-12-06 08:00', 'YYYY-MM-DD HH:mm'),
      //end: moment('2015-12-06 09:30', 'YYYY-MM-DD HH:mm'),
      ////workstationId: 22
  //},
  //{
      //start: moment('2015-12-06 11:00', 'YYYY-MM-DD HH:mm'),
      //end: moment('2015-12-06 11:30', 'YYYY-MM-DD HH:mm'),
      ////workstationId: 24
  //},
];

//const specialWorkingHours = {
  ////'2015-12-06':['Bella', 'Raga'],
  //'2015-12-07':[
  //]
//};

const workstationIds = [1, 2, 3];

const rr = awesomeStuff({
  workstationIds,
  period,
  bookingDuration,
  paddingDuration,
  fixedClosingDays,
  specialClosingDays,
  weekWorkingHours,
  //specialWorkingHours,
  bookings
});
R.map(impure.logTimeRange, rr);
//awesomeStuff({

  //period: {
    //start: moment(),
    //end: moment()
  //}
  ////bookings: [
    ////{
      ////start: moment(),
      ////end: moment(),
      ////workstationId: null
    ////}
  ////],

  ////workstationIds: [1, 2, 3, 4],

  //////bookingDuration: ,

  ////paddingDuration: moment(),

  ////weekWorkingHours: [
      ////{

      ////}
  ////],

  ////specialWorkingHours: [
    ////{

    ////}
  ////],

  ////fixedClosingDays: [],

  ////specialClosingDays: [],

//});
