import moment, { Moment } from 'moment';

export const formatDate = (date: string | Moment, format: string): Moment | undefined => {
  if (!date) {
    return undefined;
  }

  if (typeof date === 'string') {
    return moment(date, format);
  } else {
    return moment(date, format);
  }
};
