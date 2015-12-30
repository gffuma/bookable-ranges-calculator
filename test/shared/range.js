var moment = require('moment');
var R = require('ramda');

// Factory new range of dates
exports.range = function(start, end) {
  return {
    start: moment(start),
    end: moment(end)
  };
};

// Factory new range parsing hours instead of dates
exports.hourRange = function(start, end) {
  return {
    start: moment(start, 'HH:mm:ss'),
    end: moment(end, 'HH:mm:ss')
  };
};

// Factory new bookable range
exports.bookableRange = function(start, end, wIds) {
  return {
    start: moment(start),
    end: moment(end),
    workstationIds: wIds
  };
};
