import { Duration, Moment } from 'moment';
import React from 'react';
import moment from 'moment';
import { Dates, Range, Locale, defaultLocale, MaxSpan } from '../interfaces';
import { formatDate } from '../utils';
import { convert } from '../utils/RangeUtils';
import cn from 'classnames';

export interface DateRangePickerProps {
  /**
   * The parent element.
   *
   * @default body
   */
  parentEl?: HTMLElement;
  /**
   * The element to attach the dateRangePicker to.
   */
  children: React.ReactElement;
  /**
   * The value.
   *
   * Predefined range or only start and/or end date(in case of custom range).
   */
  value?: Range | Dates;
  /** The earliest date a user may select. */
  min?: Moment | string;
  /** The latest date a user may select. */
  max?: Moment | string;
  /** The maximum span between the selected start and end dates. */
  maxSpan?: Duration;
  /**
   * Automatically apply a new date range as soon as two dates are clicked (Apply and cancel button are hidden).
   *
   * @default false
   */
  autoApply?: boolean;
  /**
   * Show only a single calendar to choose one date, instead of a range picker with two calendars.
   * The start and end dates provided to the onChange callback will be the same single date chosen.
   *
   * @default false
   */
  singleDatePicker?: boolean;
  /**
   * Show year and month select boxes above calendars to jump to a specific month and year.
   *
   * @default false
   */
  showDropdowns?: boolean;
  /**
   * The minimum year shown in the dropdowns when showDropdowns is set to true.
   *
   * @default "currentYear - 100"
   */
  minYear?: string;
  /**
   * The minimum year shown in the dropdowns when showDropdowns is set to true.
   *
   * @default "currentYear + 100"
   */
  maxYear?: string;
  /**
   * Show localized week numbers at the start of each week on the calendars.
   *
   * @default false
   */
  showWeekNumbers?: boolean;
  /**
   * Show iso week numbers at the start of each week on the calendars.
   *
   * @default false
   */
  showISOWeekNumbers?: boolean;
  /**
   * Displays "Custom Range" at the end of the list of predefined ranges, when the ranges option is used.
   *
   * @default true
   */
  showCustomRangeLabel?: boolean;
  /**
   * Adds select boxes to choose times in addition to dates.
   *
   * @default false
   */
  timePicker?: boolean;
  /**
   * Use 24-hour instead of 12-hour times, removing the AM/PM selection.
   *
   * @default true
   */
  timePicker24Hour?: boolean;
  /**
   * Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30).
   *
   * @default 1
   */
  timePickerIncrement?: number;
  /**
   * Show seconds in the timePicker.
   *
   * @default false
   */
  timePickerSeconds?: boolean;
  /**
   * When enabled, the two calendars displayed will always be for two sequential months.
   *
   * @default false
   */
  linkedCalendars?: boolean;
  /**
   * Indicates whether the date range picker should automatically update the value of the <input> element it's attached to.
   *
   * @default false
   */
  autoUpdateInput?: boolean;
  /**
   * Normally, if you use the ranges option to specify pre-defined date ranges,
   * calendars for choosing a custom date range are not shown until the user clicks "Custom Range".
   * When this option is set to true, the calendars for choosing a custom date range are always shown instead.
   *
   * @default false
   */
  alwaysShowCalendars?: boolean;
  /**
   * The predefined ranges.
   *
   * @default false
   */
  ranges?: Range[];
  /**
   * Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to.
   *
   * @default RIGHT
   */
  opens?: 'LEFT' | 'RIGHT' | 'CENTER';
  /**
   * Whether the picker appears below or above the HTML element it's attached to.
   *
   * @default DOWN
   */
  drops?: 'DOWN' | 'UP';
  /**
   * Allows you to provide localized strings for buttons and labels, customize the date format, and change the first day of week for the calendars,
   *
   * @default defaultLocale
   */
  locale?: Locale;
  /**
   * CSS class names that will be added to both the apply and cancel buttons.
   */
  buttonClasses?: string;
  /**
   * CSS class names that will be added only to the apply button.
   */
  applyButtonClasses?: string;
  /**
   * CSS class names that will be added only to the cancel button.
   */
  cancelButtonClasses?: string;
  /**
   * The disabled property.
   */
  disabled?: boolean;
  /**
   * The on change handler.
   *
   * @param selected the seleced range or dates
   */
  onChange?(selected: Range | Dates): void;
}

const dateRangePicker = ({
  parentEl = document.body,
  children,
  value = { start: moment(), end: moment() },
  min,
  max,
  maxSpan,
  singleDatePicker = false,
  showDropdowns = false,
  minYear = moment().subtract(100, 'year').format('YYYY'),
  maxYear = moment().add(100, 'year').format('YYYY'),
  showWeekNumbers = false,
  showISOWeekNumbers = false,
  showCustomRangeLabel = true,
  timePicker = false,
  timePicker24Hour = true,
  timePickerIncrement = 1,
  timePickerSeconds = false,
  linkedCalendars = true,
  autoApply = false,
  autoUpdateInput = true,
  alwaysShowCalendars = false,
  ranges = [],
  opens = 'RIGHT',
  drops = 'DOWN',
  locale = defaultLocale(),
  buttonClasses = 'btn btn-sm',
  applyButtonClasses = 'btn-primary',
  cancelButtonClasses = 'btn-default',
  disabled,
  onChange,
}: DateRangePickerProps) => {
  const userLocale = { ...defaultLocale(), ...locale };

  let startDate = timePicker
    ? formatDate(value.start, userLocale.format).startOf('day')
    : formatDate(value.start, userLocale.format);
  let endDate = timePicker
    ? formatDate(value.end, userLocale.format).endOf('day')
    : formatDate(value.end, userLocale.format);
  let minDate = formatDate(min, userLocale.format);
  let maxDate = formatDate(max, userLocale.format);

  // Set maxDate higher if ranges exceed max date.
  ranges.forEach((range) => {
    const start = formatDate(range.start, userLocale.format);
    if (maxSpan && maxDate && start.clone().add(maxSpan).isAfter(maxDate)) {
      maxDate = start.clone().add(maxSpan);
    }
  });

  let convertedRanges = convert(
    ranges,
    userLocale.format,
    minDate,
    maxDate,
    timePicker
  );

  // Set value dates to min and max if exceeded
  if (minDate && startDate.isBefore(minDate)) {
    startDate = minDate.clone();
  }

  if (maxDate && endDate.isAfter(maxDate)) {
    endDate = maxDate.clone();
  }

  // update day names order to firstDay
  if (userLocale.firstDay != 0) {
    var iterator = userLocale.firstDay;
    while (iterator > 0) {
      userLocale.daysOfWeek.push(userLocale.daysOfWeek.shift());
      iterator--;
    }
  }

  /** ---- RENDER FUNCTIONS ---- */
  const renderRanges = () => {
    return (
      <div className='ranges'>
        {convertedRanges.map(({ label }) => (
          <li data-range-key={label}>{label}</li>
        ))}
        {showCustomRangeLabel && (
          <li data-range-key={userLocale.customRangeLabel}>
            {userLocale.customRangeLabel}
          </li>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'daterangepicker',
        `${userLocale.direction}`,
        `opens${opens.toLowerCase()}`,
        {
          'auto-apply': autoApply && !timePicker,
          'show-ranges': convertedRanges.length > 0,
          single: singleDatePicker,
          'show-calendar':
            (convertedRanges.length === 0 && !singleDatePicker) ||
            alwaysShowCalendars,
        }
      )}
    >
      {convertedRanges.length > 0 && renderRanges()}
      {singleDatePicker && (
        <div
          className={cn('drp-calendar left', {
            single: singleDatePicker,
          })}
        >
          <div className='calendar-table'></div>
          <div className='calendar-time'></div>
        </div>
      )}
      {!singleDatePicker && (
        <div className='drp-calendar right'>
          <div className='calendar-table'></div>
          {timePicker && <div className='calendar-time'></div>}
        </div>
      )}
      <div className='drp-buttons'>
        <span className='drp-selected'></span>
        <button
          className={cn('cancelBtn', {
            buttonClasses: buttonClasses && buttonClasses.length > 0,
            cancelButtonClasses:
              cancelButtonClasses && cancelButtonClasses.length > 0,
          })}
          type='button'
        ></button>
        <button
          className={cn('applyBtn', {
            buttonClasses: buttonClasses && buttonClasses.length > 0,
            applyButtonClasses:
              applyButtonClasses && applyButtonClasses.length > 0,
          })}
          disabled={disabled}
          type='button'
        ></button>
      </div>
    </div>
  );
};

export default dateRangePicker;
