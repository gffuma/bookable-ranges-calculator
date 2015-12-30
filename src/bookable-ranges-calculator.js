import moment from 'moment';
import R from 'ramda';
import * as M from './moment-funct';

// Check if range is in the same day
const isRangeSameDay = (range) => M.isSameDay(range.start, range.end);

// Check if two ranges are equals
const areRangeEquals = R.curry((range, equaltToRange) => {
  return M.isEqual(range.start, equaltToRange.start) &&
         M.isEqual(range.end, equaltToRange.end);
});

// Check if time range contains another time range
const containsRange = R.curry((range, containedRange) => {
  return M.isBeforeOrEq(range.start, containedRange.start) &&
         M.isAfterOrEq(range.end, containedRange.end);
});

// Check if time range overlap another range
const overlapRange = R.curry((range, overlappedRange) => {
  return M.isBefore(range.start, overlappedRange.end) &&
         M.isAfter(range.end, overlappedRange.start);
});

// Check if time range is contained in given time ranges
const containedInRanges = R.curry((containRanges, range) => {
  return R.any(containsRange(R.__, range), containRanges);
});

// Check if any ranges equalt to given range
const anyRangesEq = R.curry((ranges, range) => {
  return R.any(areRangeEquals(range), ranges);
});

// Try to find the near range of given ranges
const nearRange = R.curry((ranges, range) => {
  const isAfterOrEqRange = R.useWith(M.isAfterOrEq, [R.prop('end'), R.prop('end')]);
  return R.find(isAfterOrEqRange(R.__, range), ranges);
});

// Set range day by moment
const setRangeDay = R.curry((m, range) => {
  return {
    start: M.setDay(range.start, m),
    end: M.setDay(range.end, m)
  };
});

// Set ranges day by moment
const setRangesDay = R.curry((m, ranges) => R.map(setRangeDay(m), ranges));

// Calculate bookable time ranges without worrying about workstation
const calculateBookableRangesSimply = (options) => {

  const addBookingDuration = M.addDuration(options.bookingDuration);
  const addPaddingDuration = M.addDuration(options.paddingDuration);

  const isFixedClosingDay = M.isInDates(options.fixedClosingDays);
  const isSpecialClosingDay = M.isInDays(options.specialClosingDays);

  const isWeekWorkingDay = R.compose(R.has(R.__, options.weekWorkingHours), M.dayOfWeek);
  const isSpecialWorkingDay = R.compose(R.has(R.__, options.specialWorkingHours), M.formatAsDate);

  const isValidDay = R.both(
    R.complement(isSpecialClosingDay),
    R.either(
      isSpecialWorkingDay,
      R.both(
        R.complement(isFixedClosingDay),
        isWeekWorkingDay
      )
    )
  );

  const getWeekWorkingHours = R.compose(R.prop(R.__, options.weekWorkingHours), M.dayOfWeek);
  const getSpecialWorkingHours = R.compose(R.prop(R.__, options.specialWorkingHours), M.formatAsDate);

  const getWorkingHours = R.ifElse(
    isSpecialWorkingDay,
    getSpecialWorkingHours,
    R.ifElse(isWeekWorkingDay, getWeekWorkingHours, R.F)
  );
  const getWorkingHoursFixed = (m) => setRangesDay(m, getWeekWorkingHours(m));

  const isRangeInPeriod = containsRange(options.period);

  // Recursion function
  const calculate = (startRangeMoment, bookableRanges) => {

    const appendToBookableRanges = R.append(R.__, bookableRanges);

    const endRangeMoment = addBookingDuration(startRangeMoment);
    const range = {
      start: startRangeMoment,
      end: endRangeMoment
    };

    // End of recursion, finally return all saved bookableRanges
    if (! isRangeInPeriod(range)) {
      return bookableRanges;
    }

    // TODO: Range with different days not handled...
    if (! isRangeSameDay(range)) {
      return calculate(M.startOfDay(range.end), bookableRanges);
    }

    // Check the day if invalid go to start of next day
    if (! isValidDay(range.start)) {
      return calculate(M.startOfNextDay(range.start), bookableRanges);
    }

    // Bookable ranges must be in a valid working range,
    // if isn't take the near start of working range if exist
    // or fallback to the next day
    const workingHours = getWorkingHoursFixed(range.start);

    if (! containedInRanges(workingHours, range)) {

      const nearWorkingRange = nearRange(workingHours, range);

      if (nearWorkingRange === undefined) {
        return calculate(M.startOfNextDay(range.start), bookableRanges);
      } else {
        return calculate(nearWorkingRange.start, bookableRanges);
      }

    }

    // Overlapped bookings of current range
    const overlappedBookings = R.filter(overlapRange(range), options.bookings);

    if (overlappedBookings.length) {

      const rangeMoreFar = R.last(R.sortBy(R.prop('end'), overlappedBookings));
      return calculate(addPaddingDuration(rangeMoreFar.end), bookableRanges);
    }

    // Range ok, next range with padding
    return calculate(addPaddingDuration(range.end), appendToBookableRanges(range));
  };

  return calculate(options.period.start, []);

};

// Calculate bookable ranges
const calculateBookableRanges = (options) => {

  const defaultizeOptions = R.merge({
    bookings: [],
    weekWorkingHours: {},
    specialWorkingHours: {},
    fixedClosingDays: [],
    specialClosingDays: [],
  });

  const calculateOptions = defaultizeOptions(options);

  if (R.isArrayLike(calculateOptions.workstationIds)) {

    const wIds = calculateOptions.workstationIds;

    const calulateRangesOfWorkstation = (wId) => {

      const bookings = calculateOptions.bookings;
      const filterByWorkstation = R.filter(R.propEq('workstationId', wId));
      const bookingsOfWorkstation = filterByWorkstation(bookings);

      const bookingsLens = R.lensProp('bookings');
      const optionsOfWorkstation = R.set(bookingsLens, bookingsOfWorkstation);

      return calculateBookableRangesSimply(optionsOfWorkstation(calculateOptions));
    };

    return R.compose(R.sortBy(R.prop('start')), R.reduce((bookableRanges, wId) => {

      const appendWorkstation = (range) => {
        return R.set(
          R.lensProp('workstationIds'),
          R.append(wId, range.workstationIds),
          range
        );
      };

      const workstationRanges = calulateRangesOfWorkstation(wId);

      return R.concat(
        R.map(
          R.ifElse(
            anyRangesEq(workstationRanges),
            appendWorkstation,
            R.identity
          ),
          bookableRanges
        ),
        R.map(appendWorkstation, R.filter(
          R.complement(anyRangesEq(bookableRanges)),
          workstationRanges
        ))
      );

    }, []))(wIds);

  } else {
    // Calculation with no workstations is a calculateBookableRangesSimply
    return calculateBookableRangesSimply(calculateOptions);
  }

};

export default calculateBookableRanges;
