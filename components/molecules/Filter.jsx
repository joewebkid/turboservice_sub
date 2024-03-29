import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import Block from "../atoms/Block";
import DataInput from "../atoms/DataInput";
import FilterData from "../atoms/FilterInput/FilterData";
import FilterInput from "../atoms/FilterInput/FilterInput";
import SelectInput from "../atoms/FilterInput/SelectInput";
import useDebounce from "../atoms/FilterInput/useDebounce";
import FlexBlock from "../atoms/FlexBlock";
import { formatDate } from "./data";
import { t } from "../translation/data";

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
    router,
    type_cab,
    vehicles_tab,
  } = props;

  const status_tab_selected = type_cab == "vehicles" ? 2 : selectStatus;

  const debonceTime = process.env.NEXT_PUBLIC_FILTER_DEBONCE
    ? Number(process.env.NEXT_PUBLIC_FILTER_DEBONCE)
    : 1000;

  const [filter_values, saveFilterValues] = useState(filter_values_saved);
  const [selected_statuses, setSelectedStatuses] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [search_string, setSearchString] = useState("");
  const [isFirstTime, setIsFirstTime] = useState(1);
  const [isClearFilter, setIsClearFilter] = useState(10);

  const debouncedSearchTerm = useDebounce(
    search_string,
    isClearFilter ? isClearFilter : debonceTime
  );

  // console.log(filter_values, selected_statuses);
  useEffect(() => {
    if (!isSearching) {
      if (vehicles_tab)
        localStorage.setItem(
          "filter_values_vehicles",
          JSON.stringify(filter_values)
        );
      else {
        localStorage.setItem("filter_values", JSON.stringify(filter_values));
      }
      let stringInput = Object.keys(filter_values)
        .map(function (i) {
          return [i, filter_values[i]].join("=");
        })
        .join("&");

      // console.log("filter_values", selectStatus);
      if (status_tab_selected != undefined) {
        localStorage.setItem("filter_status", status_tab_selected);
        stringInput = stringInput + "&OrderStatusID[]=" + status_tab_selected;
      }

      setSearchString(stringInput);
    }
  }, [filter_values]);

  useEffect(() => {
    if (!isSearching) {
      if (vehicles_tab)
        localStorage.setItem(
          "filter_values_vehicles",
          JSON.stringify(filter_values)
        );
      else {
        localStorage.setItem("filter_values", JSON.stringify(filter_values));
        localStorage.setItem("filter_status", status_tab_selected);
      }
      let stringInput = Object.keys(filter_values)
        .map(function (i) {
          return [i, filter_values[i]].join("=");
        })
        .join("&");

      // console.log("status_tab_selected", status_tab_selected);

      if (status_tab_selected != undefined) {
        stringInput = stringInput + "&OrderStatusID[]=" + status_tab_selected;
      }

      if (isFirstTime) {
        setIsFirstTime(false);
        return;
      }

      setIsClearFilter(false);

      if (!isSearching) {
        setIsSearching(true);
        setDataLoading(true);
        filter_callback(
          saveData,
          SESSIONID,
          stringInput,
          setIsSearching,
          setTotal,
          offset,
          limit,
          () => {
            setIsSearching(false);
            setDataLoading(false);
          },
          router,
          type_cab
        );
        setTimeout(() => {}, 10);
      }
    }
  }, [status_tab_selected]);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
      return;
    }
    setIsClearFilter(false);

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
        limit,
        () => {
          setIsSearching(false);
          setDataLoading(false);
        },
        router,
        type_cab
      );
      setTimeout(() => {}, 10);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
      return;
    }

    let stringInput = search_string;
    if (status_tab_selected != undefined) {
      localStorage.setItem("filter_status", status_tab_selected);
      stringInput = stringInput + "&OrderStatusID[]=" + status_tab_selected;
    }

    if (!isSearching && offset >= 0) {
      setIsSearching(true);
      setDataLoading(true);
      filter_callback(
        saveData,
        SESSIONID,
        stringInput,
        setIsSearching,
        setTotal,
        offset,
        limit,
        () => {
          setIsSearching(false);
          setDataLoading(false);
        },
        router,
        type_cab
      );
      setTimeout(() => {
        setIsSearching(false);
        setDataLoading(false);
      }, 10);
    }
  }, [offset, limit]);

  return (
    <>
      {filter_values ? (
        <tr>
          {headers.map((h, key) =>
            type_cab == "vehicles" && h.hiddenOnVehicles ? (
              <></>
            ) : (
              <th className={isSearching ? "loadingBlock" : ""} key={key}>
                {h.type == "text" ? (
                  <FlexBlock className="filterControll">
                    <Form.Control
                      required
                      type="text"
                      placeholder={t("all")}
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
                            setIsClearFilter(true);
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
                  <FlexBlock
                    className={
                      "dateRangeFilter" +
                      (type_cab == "vehicles" ? " datapicker-top-left" : "") +
                      (h.show_more_than != undefined &&
                      h.show_more_than > status_tab_selected
                        ? " unuseable"
                        : "")
                    }
                  >
                    <DataInput
                      short
                      clear
                      placeholder={t("from")}
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
                      placeholder={t("to")}
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
                  <SelectInput
                    {...props}
                    style={h.style ? h.style : {}}
                    header={t(h.t)}
                    options={h.options}
                    saveFilterValues={(values) => {
                      saveFilterValues({
                        ...filter_values,
                        [h.filter]: values,
                      });
                    }}
                    value={
                      Object.keys(filter_values).length
                        ? filter_values[h.filter]
                        : ""
                    }
                  />
                ) : (
                  //
                  <></>
                )}
              </th>
            )
          )}

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
      ) : (
        <></>
      )}{" "}
      <tr>
        <td
          colSpan={type_cab == "vehicles" ? headers.length - 1 : headers.length}
        >
          <FlexBlock justify="flex-end">
            <div
              class="indexTab"
              onClick={() => {
                setIsClearFilter(true);
                saveFilterValues({});
              }}
            >
              {t("clear")}
            </div>
          </FlexBlock>
        </td>
      </tr>
    </>
  );
});

export default Filter;
