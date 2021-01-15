import React, { useEffect, useState } from "react";
import { enUS } from "date-fns/locale";
import { DateRangePicker, START_DATE, END_DATE } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import FilterInput from "./FilterInput";
import { Form } from "react-bootstrap";
import FlexBlock from "../FlexBlock";

const FilterData = (props) => {
  const { setFilterStartDate, setFilterEndDate } = props;

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    setFilterEndDate(startDate, endDate);
    // setFilterStartDate(startDate);

    // get_orders(setOrders, SESSIONID);
    // get_statuses(setStatuses, router, SESSIONID);
    // setCurrentPage(0);
  }, [endDate]);

  return (
    <FlexBlock>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        //   minimumDate={new Date()}
        minimumLength={1}
        format="dd/MM"
        locale={enUS}
      >
        {({ startDateInputProps, endDateInputProps, focus }) => (
          <FlexBlock className="date-range">
            <input
              type="text"
              class="form-control"
              {...startDateInputProps}
              style={{
                padding: 0,
                textAlign: "center",
                width: 55,
                borderRight: 0,
                borderRadius: ".25rem 0 0 .25rem",
              }}
              placeholder="FROM"
              setEffectValue={endDate}
              // setEffectValue={startDate}
            />
            <FilterInput
              className={"input" + (focus === END_DATE ? " -focused" : "")}
              template={(props) => (
                <Form.Control
                  type="text"
                  {...endDateInputProps}
                  disabled
                  placeholder="TO"
                  setEffectValue={endDate}
                  style={{
                    padding: 0,
                    textAlign: "center",
                    width: 55,
                    borderRadius: "0 .25rem  .25rem 0",
                  }}
                />
              )}
            />
          </FlexBlock>
        )}
      </DateRangePicker>

      {startDate && endDate ? (
        <FlexBlock
          className="deleteLink delFilter"
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setFilterEndDate(startDate, endDate);
          }}
        >
          ✕
        </FlexBlock>
      ) : (
        <></>
      )}
    </FlexBlock>
  );
};

export default FilterData;
