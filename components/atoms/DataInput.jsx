import React, { useEffect, useState } from "react";
import { enUS } from "date-fns/locale";
import { DatePicker } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import { formatDateForPost } from "../molecules/data";

const DataInput = (props) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (date) props.callback(date);
  }, [date]);

  useEffect(() => {
    if (props.value) setDate(props.value);
  }, []);

  return (
    <DatePicker
      date={new Date(date)}
      onDateChange={(date) => setDate(formatDateForPost(date))}
      locale={enUS}
    >
      {({ inputProps, focused }) => (
        <input
          className={"form-control input" + (focused ? " -focused" : "")}
          {...inputProps}
          value={formatDateForPost(date, props.type)}
        />
      )}
    </DatePicker>
  );
};
export default DataInput;
