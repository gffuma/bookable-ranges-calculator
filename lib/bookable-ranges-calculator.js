'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _momentFunct = require('./moment-funct');

var M = _interopRequireWildcard(_momentFunct);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

// Check if range is in the same day
var isRangeSameDay = function isRangeSameDay(range) {
  return M.isSameDay(range.start, range.end);
};

// Check if two ranges are equals
var areRangeEquals = _ramda2.default.curry(function (range, equaltToRange) {
  return M.isEqual(range.start, equaltToRange.start) && M.isEqual(range.end, equaltToRange.end);
});

// Check if time range contains another time range
var containsRange = _ramda2.default.curry(function (range, containedRange) {
  return M.isBeforeOrEq(range.start, containedRange.start) && M.isAfterOrEq(range.end, containedRange.end);
});

// Check if time range overlap another range
var overlapRange = _ramda2.default.curry(function (range, overlappedRange) {
  return M.isBefore(range.start, overlappedRange.end) && M.isAfter(range.end, overlappedRange.start);
});

// Check if time range is contained in given time ranges
var containedInRanges = _ramda2.default.curry(function (containRanges, range) {
  return _ramda2.default.any(containsRange(_ramda2.default.__, range), containRanges);
});

// Check if any ranges equalt to given range
var anyRangesEq = _ramda2.default.curry(function (ranges, range) {
  return _ramda2.default.any(areRangeEquals(range), ranges);
});

// Try to find the near range of given ranges
var nearRange = _ramda2.default.curry(function (ranges, range) {
  var isAfterOrEqRange = _ramda2.default.useWith(M.isAfterOrEq, [_ramda2.default.prop('end'), _ramda2.default.prop('end')]);
  return _ramda2.default.find(isAfterOrEqRange(_ramda2.default.__, range), ranges);
});

// Set range day by moment
var setRangeDay = _ramda2.default.curry(function (m, range) {
  return {
    start: M.setDay(range.start, m),
    end: M.setDay(range.end, m)
  };
});

// Set ranges day by moment
var setRangesDay = _ramda2.default.curry(function (m, ranges) {
  return _ramda2.default.map(setRangeDay(m), ranges);
});

// Calculate bookable time ranges without worrying about workstation
var calculateBookableRangesSimply = function calculateBookableRangesSimply(options) {

  var addBookingDuration = M.addDuration(options.bookingDuration);
  var addPaddingDuration = M.addDuration(options.paddingDuration);

  var isFixedClosingDay = M.isInDates(options.fixedClosingDays);
  var isSpecialClosingDay = M.isInDays(options.specialClosingDays);

  var isWeekWorkingDay = _ramda2.default.compose(_ramda2.default.has(_ramda2.default.__, options.weekWorkingHours), M.dayOfWeek);
  var isSpecialWorkingDay = _ramda2.default.compose(_ramda2.default.has(_ramda2.default.__, options.specialWorkingHours), M.formatAsDate);

  var isValidDay = _ramda2.default.both(_ramda2.default.complement(isSpecialClosingDay), _ramda2.default.either(isSpecialWorkingDay, _ramda2.default.both(_ramda2.default.complement(isFixedClosingDay), isWeekWorkingDay)));

  var getWeekWorkingHours = _ramda2.default.compose(_ramda2.default.prop(_ramda2.default.__, options.weekWorkingHours), M.dayOfWeek);
  var getSpecialWorkingHours = _ramda2.default.compose(_ramda2.default.prop(_ramda2.default.__, options.specialWorkingHours), M.formatAsDate);

  var getWorkingHours = _ramda2.default.ifElse(isSpecialWorkingDay, getSpecialWorkingHours, _ramda2.default.ifElse(isWeekWorkingDay, getWeekWorkingHours, _ramda2.default.F));
  var getWorkingHoursFixed = function getWorkingHoursFixed(m) {
    return setRangesDay(m, getWeekWorkingHours(m));
  };

  var isRangeInPeriod = containsRange(options.period);

  // Recursion function
  var calculate = function calculate(startRangeMoment, bookableRanges) {

    var appendToBookableRanges = _ramda2.default.append(_ramda2.default.__, bookableRanges);

    var endRangeMoment = addBookingDuration(startRangeMoment);
    var range = {
      start: startRangeMoment,
      end: endRangeMoment
    };

    // End of recursion, finally return all saved bookableRanges
    if (!isRangeInPeriod(range)) {
      return bookableRanges;
    }

    // TODO: Range with different days not handled...
    if (!isRangeSameDay(range)) {
      return calculate(M.startOfDay(range.end), bookableRanges);
    }

    // Check the day if invalid go to start of next day
    if (!isValidDay(range.start)) {
      return calculate(M.startOfNextDay(range.start), bookableRanges);
    }

    // Bookable ranges must be in a valid working range,
    // if isn't take the near start of working range if exist
    // or fallback to the next day
    var workingHours = getWorkingHoursFixed(range.start);

    if (!containedInRanges(workingHours, range)) {

      var nearWorkingRange = nearRange(workingHours, range);

      if (nearWorkingRange === undefined) {
        return calculate(M.startOfNextDay(range.start), bookableRanges);
      } else {
        return calculate(nearWorkingRange.start, bookableRanges);
      }
    }

    // Overlapped bookings of current range
    var overlappedBookings = _ramda2.default.filter(overlapRange(range), options.bookings);

    if (overlappedBookings.length) {

      var rangeMoreFar = _ramda2.default.last(_ramda2.default.sortBy(_ramda2.default.prop('end'), overlappedBookings));
      return calculate(addPaddingDuration(rangeMoreFar.end), bookableRanges);
    }

    // Range ok, next range with padding
    return calculate(addPaddingDuration(range.end), appendToBookableRanges(range));
  };

  return calculate(options.period.start, []);
};

// Calculate bookable ranges
var calculateBookableRanges = function calculateBookableRanges(options) {

  var defaultizeOptions = _ramda2.default.merge({
    bookings: [],
    weekWorkingHours: {},
    specialWorkingHours: {},
    fixedClosingDays: [],
    specialClosingDays: []
  });

  var calculateOptions = defaultizeOptions(options);

  if (_ramda2.default.isArrayLike(calculateOptions.workstationIds)) {
    var _ret = (function () {

      var wIds = calculateOptions.workstationIds;

      var calulateRangesOfWorkstation = function calulateRangesOfWorkstation(wId) {

        var bookings = calculateOptions.bookings;
        var filterByWorkstation = _ramda2.default.filter(_ramda2.default.propEq('workstationId', wId));
        var bookingsOfWorkstation = filterByWorkstation(bookings);

        var bookingsLens = _ramda2.default.lensProp('bookings');
        var optionsOfWorkstation = _ramda2.default.set(bookingsLens, bookingsOfWorkstation);

        return calculateBookableRangesSimply(optionsOfWorkstation(calculateOptions));
      };

      return {
        v: _ramda2.default.compose(_ramda2.default.sortBy(_ramda2.default.prop('start')), _ramda2.default.reduce(function (bookableRanges, wId) {

          var appendWorkstation = function appendWorkstation(range) {
            return _ramda2.default.set(_ramda2.default.lensProp('workstationIds'), _ramda2.default.append(wId, range.workstationIds), range);
          };

          var workstationRanges = calulateRangesOfWorkstation(wId);

          return _ramda2.default.concat(_ramda2.default.map(_ramda2.default.ifElse(anyRangesEq(workstationRanges), appendWorkstation, _ramda2.default.identity), bookableRanges), _ramda2.default.map(appendWorkstation, _ramda2.default.filter(_ramda2.default.complement(anyRangesEq(bookableRanges)), workstationRanges)));
        }, []))(wIds)
      };
    })();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    // Calculation with no workstations is a calculateBookableRangesSimply
    return calculateBookableRangesSimply(calculateOptions);
  }
};

exports.default = calculateBookableRanges;
module.exports = exports['default'];