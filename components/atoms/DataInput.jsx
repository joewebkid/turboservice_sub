import React, { useEffect, useState } from "react";
import { enUS } from "date-fns/locale";
import { DatePicker } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import {
  formatDate,
  formatShortDate,
  formatDateForPost,
  formatDateForView,
} from "../molecules/data";
import FlexBlock from "./FlexBlock";

const DataInput = (props) => {
  const { defaultDate, value, short, clear, placeholder, noreload } = props;
  const [date, setDate] = useState(
    clear ? "" : value || defaultDate || new Date()
  );
  const [isFirstTime, setIsFirstTime] = useState(1);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(0);
      return;
    }

    if (date) props.callback(date);
  }, [date]);

  useEffect(() => {
    if (!noreload) {
      if (!value) setDate(false);
      else setDate(value);
    }
  }, [value]);
  // console.log(date, 1);

  return (
    <DatePicker
      date={date ? new Date(date) : new Date()}
      onDateChange={(date) => {
        // console.log(date);
        setDate(formatDateForPost(date));
      }}
      locale={enUS}
    >
      {({ inputProps, focused }) => (
        <FlexBlock>
          <input
            className={"form-control input" + (focused ? " -focused" : "")}
            {...inputProps}
            value={
              date
                ? short
                  ? formatShortDate(date)
                  : formatDateForView(date)
                : ""
            }
            placeholder={placeholder}
          />
          {date && clear ? (
            <FlexBlock className="deleteBlockRight">
              <FlexBlock
                className="deleteLink delFilter"
                onClick={() => {
                  setDate("");
                  props.callback("");
                }}
              >
                ✕
              </FlexBlock>
            </FlexBlock>
          ) : (
            <></>
          )}
        </FlexBlock>
      )}
    </DatePicker>
  );
};
export default DataInput;
