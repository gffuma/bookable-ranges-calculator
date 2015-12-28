import moment from 'moment';
import R from 'ramda';

// Start day of moment
export const startOfDay = (m) => m.clone().startOf('day');

// Next day of moment
export const nextDay = (m) => m.clone().add(1, 'days');

// Start of next day of moment
export const startOfNextDay = R.compose(startOfDay, nextDay);

// Get moment day of week
export const dayOfWeek = (m) => m.day();

// Format moment as date
export const formatAsDate = (m) => m.format('YYYY-MM-DD');

// Set day of given moment using another moment
export const setDay = R.curry((m1, m2) => {
  return m2.clone().hour(m1.hour()).minute(m1.minute()).second(m1.second());
});

// Add duration to moment
export const addDuration = R.curry((duration, m) => m.clone().add(duration));

// Check if moment is before to another moment
export const isBefore = R.curry((m1, m2) => m1.isBefore(m2));

// Check if moment is after to another moment
export const isAfter = R.curry((m1, m2) => m1.isAfter(m2));

// Check if moment is before or equalt to another moment
export const isBeforeOrEq = R.curry((m1, m2) => m1.isBefore(m2) || m1.isSame(m2));

// Check if moment is after or equalt to another moment
export const isAfterOrEq = R.curry((m1, m2) => m1.isAfter(m2) || m1.isSame(m2));

// Check if moment is equalt to another moment
export const isEqual = R.curry((m1, m2) => m1.isSame(m2));

// Check if two moment are in the same day
export const isSameDay = R.curry((m1, m2) => m1.isSame(m2, 'day'));

// Check if two moment are in the same date
export const isSameDate = R.curry((m1, m2) => {
  return m1.month() === m2.month() && m1.date() === m2.date();
});

// Check if moment is in days
export const isInDays = R.curry((days, m) => R.any(isSameDay(m), days));

// Check if moment is in dates
export const isInDates = R.curry((dates, m) => R.any(isSameDate(m), dates));
