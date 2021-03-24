import React, { useEffect, useState } from "react";
import { et, ru, enAU } from "date-fns/locale";
import { DatePicker } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import {
  formatDate,
  formatShortDate,
  formatDateForPost,
  formatDateForView,
} from "../molecules/data";
import FlexBlock from "./FlexBlock";

import { language } from "../translation/data";

const DataInput = (props) => {
  const {
    defaultDate,
    value,
    short,
    clear,
    placeholder,
    noreload,
    readOnly,
  } = props;
  const [date, setDate] = useState(value || defaultDate || new Date());
  const [isFirstTime, setIsFirstTime] = useState(1);

  const lang_map = {
    en: enAU,
    ru: ru,
    et: et,
  };

  useEffect(() => {
    if (!noreload) {
      if (!value) setDate(false);
      else setDate(value);
    }
  }, [value]);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(0);
      return;
    }

    if (date) props.callback(date);
  }, [date]);
  // console.log(date, 1);

  return (
    <DatePicker
      date={date ? new Date(date) : null}
      onDateChange={(date) => {
        // console.log(date);
        setDate(formatDateForPost(date));
      }}
      locale={lang_map[language()] || enAU}
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
            readOnly={readOnly}
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
