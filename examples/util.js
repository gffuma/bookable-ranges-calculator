// Log a signle bookable time range
exports.logBookableRange = function(range) {
  console.log.apply(null,
    [
      'Start:', range.start.format('YYYY-MM-DD HH:mm:ss'),
      'End:', range.end.format('YYYY-MM-DD HH:mm:ss')
    ].concat(range.workstationIds === undefined ? [] : [
      'Workstations:', range.workstationIds.join()
    ])
  );
};
