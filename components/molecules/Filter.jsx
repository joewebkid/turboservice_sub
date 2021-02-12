import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import Block from "../atoms/Block";
import DataInput from "../atoms/DataInput";
import FilterData from "../atoms/FilterInput/FilterData";
import FilterInput from "../atoms/FilterInput/FilterInput";
import StatusesSelect from "../atoms/FilterInput/StatusesSelect";
import useDebounce from "../atoms/FilterInput/useDebounce";
import FlexBlock from "../atoms/FlexBlock";
import { formatDate } from "./data";

const Filter = memo((props) => {
  const {
    headers,
    // statuses,
    saveData,
    SESSIONID,
    filter_callback,
    setTotal,
    limit,
    offset,
    setCurrentPage,
    selectStatus,
    setDataLoading,
    filter_values_saved,
  } = props;

  const [filter_values, saveFilterValues] = useState(filter_values_saved);
  const [selected_statuses, setSelectedStatuses] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [search_string, setSearchString] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(1);

  const debouncedSearchTerm = useDebounce(search_string, 500);

  // console.log(filter_values, selected_statuses);
  useEffect(() => {
    if (!isSearching) {
      localStorage.setItem("filter_values", JSON.stringify(filter_values));
      localStorage.setItem("filter_status", selectStatus);
      let stringInput = Object.keys(filter_values)
        .map(function (i) {
          return [i, filter_values[i]].join("=");
        })
        .join("&");

      stringInput = stringInput + "&OrderStatusID[]=" + selectStatus;
      setSearchString(stringInput);
    }
  }, [filter_values, selectStatus]);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
      return;
    }
    console.log("isSearching", isSearching);
    if (!isSearching) {
      setIsSearching(true);
      setDataLoading(true);
      filter_callback(
        saveData,
        SESSIONID,
        search_string,
        setIsSearching,
        setTotal,
        offset,
        limit
      );
      setTimeout(() => {
        setIsSearching(false);
        setDataLoading(false);
      }, 500);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
      return;
    }

    console.log("isSearching", isSearching);
    if (!isSearching && offset >= 0) {
      setIsSearching(true);
      setDataLoading(true);
      filter_callback(
        saveData,
        SESSIONID,
        search_string,
        setIsSearching,
        setTotal,
        offset,
        limit
      );
      setTimeout(() => {
        setIsSearching(false);
        setDataLoading(false);
      }, 500);
    }
  }, [offset, limit]);

  return (
    <>
      <tr>
        {headers.map((h, key) => (
          <th className={isSearching ? "loadingBlock" : ""} key={key}>
            {h.type == "text" ? (
              <FlexBlock className="filterControll">
                <Form.Control
                  required
                  type="text"
                  placeholder="ALL"
                  onChange={(e) => {
                    setCurrentPage(0);
                    saveFilterValues({
                      ...filter_values,
                      [h.filter]: e.target.value,
                    });
                  }}
                  readonly={isSearching ? 1 : false}
                  value={
                    Object.keys(filter_values).length
                      ? filter_values[h.filter]
                      : ""
                  }
                />
                {filter_values[h.filter] != "" &&
                filter_values[h.filter] != undefined ? (
                  <FlexBlock className="deleteBlockRight">
                    <FlexBlock
                      className="deleteLink delFilter"
                      onClick={() => {
                        saveFilterValues({
                          ...filter_values,
                          [h.filter]: "",
                        });
                      }}
                    >
                      ✕
                    </FlexBlock>
                  </FlexBlock>
                ) : (
                  <></>
                )}
              </FlexBlock>
            ) : h.type == "date" ? (
              <FlexBlock className="dateRangeFilter">
                <DataInput
                  short
                  clear
                  placeholder="FROM"
                  className="dateFrom"
                  callback={(e) => {
                    // console.log(e);
                    setCurrentPage(0);
                    const formDate = formatDate(e);
                    saveFilterValues({
                      ...filter_values,
                      [h.filterFrom]: formDate,
                    });
                  }}
                  readonly={isSearching ? 1 : false}
                  value={
                    Object.keys(filter_values).length
                      ? filter_values[h.filterFrom]
                      : ""
                  }
                />
                <DataInput
                  short
                  clear
                  placeholder="TO"
                  className="dateTo"
                  callback={(e) => {
                    // console.log(e);
                    setCurrentPage(0);
                    const formDate = formatDate(e);
                    saveFilterValues({
                      ...filter_values,
                      [h.filterTo]: formDate,
                    });
                  }}
                  readonly={isSearching}
                  value={
                    Object.keys(filter_values).length
                      ? filter_values[h.filterTo]
                      : ""
                  }
                />
              </FlexBlock>
            ) : h.type == "select" ? (
              <></>
            ) : (
              // <StatusesSelect
              //   {...props}
              //   saveFilterValues={(values) => {
              //     setSelectedStatuses(values);
              //   }}
              // />
              <></>
            )}
          </th>
        ))}

        {isSearching ? (
          <FlexBlock
            justify="center"
            align="center"
            className="loadingSpinnerBlock"
          >
            <Spinner animation="grow" />
          </FlexBlock>
        ) : (
          <></>
        )}
      </tr>
      <tr>
        <td colSpan={headers.length}>
          <FlexBlock justify="flex-end">
            <div class="indexTab" onClick={() => saveFilterValues({})}>
              Clear
            </div>
          </FlexBlock>
        </td>
      </tr>
    </>
  );
});

export default Filter;
