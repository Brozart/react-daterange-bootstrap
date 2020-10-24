import { Moment } from 'moment';
import { Range } from '../interfaces';
import { formatDate } from './DateUtils';

export const convert = (
  ranges: Range[],
  format: string,
  minDate?: Moment,
  maxDate?: Moment,
  timePicker?: boolean
) =>
  ranges
    .map((range) => {
      let rangeStart = formatDate(range.start, format);
      let rangeEnd = formatDate(range.end, format);

      // If the start or end date exceed those allowed by the minDate or maxSpan
      // options, shorten the range to the allowable period.
      if (minDate && rangeStart && rangeStart.isBefore(minDate)) {
        rangeStart = minDate.clone();
      }

      if (maxDate && rangeEnd && rangeEnd.isAfter(maxDate)) {
        rangeEnd = maxDate.clone();
      }

      return {
        label: range.label,
        start: rangeStart,
        end: rangeEnd,
      };
    })
    .filter((range) => {
      // If the end of the range is before the minimum or the start of the range is
      // after the maximum, don't display this range option at all.
      let rangeStart = formatDate(range.start, format);
      let rangeEnd = formatDate(range.end, format);
      return !(
        (minDate &&
          rangeEnd &&
          rangeEnd.isBefore(minDate, timePicker ? 'minute' : 'day')) ||
        (maxDate && rangeStart.isAfter(maxDate, timePicker ? 'minute' : 'day'))
      );
    });
