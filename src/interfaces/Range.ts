import { Moment } from "moment";

export interface Dates {
    /** 
     * The start date of the range.
     * 
     * When using string type, same format as locale#dateFormat is expected.
     */
    start?: Moment | string;
    /** 
     * The end date of the range.
     * 
     * When using string type, same format as locale#dateFormat is expected.
     */
    end?: Moment | string;
}

export interface Range extends Dates {
    /** The displayed text */
    label: string;
}