'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInDates = exports.isInDays = exports.isSameDate = exports.isSameDay = exports.isEqual = exports.isAfterOrEq = exports.isBeforeOrEq = exports.isAfter = exports.isBefore = exports.addDuration = exports.setDay = exports.formatAsDate = exports.dayOfWeek = exports.startOfNextDay = exports.nextDay = exports.startOfDay = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Start day of moment
var startOfDay = exports.startOfDay = function startOfDay(m) {
  return m.clone().startOf('day');
};

// Next day of moment
var nextDay = exports.nextDay = function nextDay(m) {
  return m.clone().add(1, 'days');
};

// Start of next day of moment
var startOfNextDay = exports.startOfNextDay = _ramda2.default.compose(startOfDay, nextDay);

// Get moment day of week
var dayOfWeek = exports.dayOfWeek = function dayOfWeek(m) {
  return m.day();
};

// Format moment as date
var formatAsDate = exports.formatAsDate = function formatAsDate(m) {
  return m.format('YYYY-MM-DD');
};

// Set day of given moment using another moment
var setDay = exports.setDay = _ramda2.default.curry(function (m1, m2) {
  return m2.clone().hour(m1.hour()).minute(m1.minute()).second(m1.second());
});

// Add duration to moment
var addDuration = exports.addDuration = _ramda2.default.curry(function (duration, m) {
  return m.clone().add(duration);
});

// Check if moment is before to another moment
var isBefore = exports.isBefore = _ramda2.default.curry(function (m1, m2) {
  return m1.isBefore(m2);
});

// Check if moment is after to another moment
var isAfter = exports.isAfter = _ramda2.default.curry(function (m1, m2) {
  return m1.isAfter(m2);
});

// Check if moment is before or equalt to another moment
var isBeforeOrEq = exports.isBeforeOrEq = _ramda2.default.curry(function (m1, m2) {
  return m1.isBefore(m2) || m1.isSame(m2);
});

// Check if moment is after or equalt to another moment
var isAfterOrEq = exports.isAfterOrEq = _ramda2.default.curry(function (m1, m2) {
  return m1.isAfter(m2) || m1.isSame(m2);
});

// Check if moment is equalt to another moment
var isEqual = exports.isEqual = _ramda2.default.curry(function (m1, m2) {
  return m1.isSame(m2);
});

// Check if two moment are in the same day
var isSameDay = exports.isSameDay = _ramda2.default.curry(function (m1, m2) {
  return m1.isSame(m2, 'day');
});

// Check if two moment are in the same date
var isSameDate = exports.isSameDate = _ramda2.default.curry(function (m1, m2) {
  return m1.month() === m2.month() && m1.date() === m2.date();
});

// Check if moment is in days
var isInDays = exports.isInDays = _ramda2.default.curry(function (days, m) {
  return _ramda2.default.any(isSameDay(m), days);
});

// Check if moment is in dates
var isInDates = exports.isInDates = _ramda2.default.curry(function (dates, m) {
  return _ramda2.default.any(isSameDate(m), dates);
});