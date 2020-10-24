import moment from 'moment';

export interface Locale {
  direction?: string;
  format?: string;
  separator?: string;
  applyLabel?: string;
  cancelLabel?: string;
  weekLabel?: string;
  customRangeLabel?: string;
  daysOfWeek?: string[];
  monthNames?: string[];
  firstDay?: number;
}

export const defaultLocale = (): Locale => ({
  direction: 'ltr',
  format: moment.localeData().longDateFormat('L'),
  separator: ' - ',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  weekLabel: 'W',
  customRangeLabel: 'Custom Range',
  daysOfWeek: moment.weekdaysMin(),
  monthNames: moment.monthsShort(),
  firstDay: moment.localeData().firstDayOfWeek(),
});
