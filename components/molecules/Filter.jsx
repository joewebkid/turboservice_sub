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
  } = props;

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
      localStorage.setItem("filter_values", JSON.stringify(filter_values));
      let stringInput = Object.keys(filter_values)
        .map(function (i) {
          return [i, filter_values[i]].join("=");
        })
        .join("&");

      // console.log("filter_values", selectStatus);
      if (selectStatus != undefined) {
        localStorage.setItem("filter_status", selectStatus);
        stringInput = stringInput + "&OrderStatusID[]=" + selectStatus;
      }

      setSearchString(stringInput);
    }
  }, [filter_values]);

  useEffect(() => {
    if (!isSearching) {
      localStorage.setItem("filter_values", JSON.stringify(filter_values));
      let stringInput = Object.keys(filter_values)
        .map(function (i) {
          return [i, filter_values[i]].join("=");
        })
        .join("&");

      // console.log("selectStatus", selectStatus);

      if (selectStatus != undefined) {
        stringInput = stringInput + "&OrderStatusID[]=" + selectStatus;
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
          router
        );
        setTimeout(() => {}, 10);
      }
    }
  }, [selectStatus]);

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
        router
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
    if (selectStatus != undefined) {
      localStorage.setItem("filter_status", selectStatus);
      stringInput = stringInput + "&OrderStatusID[]=" + selectStatus;
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
        router
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
          {headers.map((h, key) => (
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
                    (type_cab == "vehicles" ? " datapicker-top-left" : "")
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
                />
              ) : (
                //
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
      ) : (
        <></>
      )}{" "}
      <tr>
        <td colSpan={headers.length}>
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
