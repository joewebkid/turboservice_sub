import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { recomendation as recomendations_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import useDebounce from "../../atoms/FilterInput/useDebounce";
import FilterData from "../../atoms/FilterInput/FilterData";
import DataInput from "../../atoms/DataInput";
import {
  formatDateForPost,
  formatDate,
  formatDateForView,
} from "../../molecules/data";
import MessageToast from "./MessageToast";
import { t } from "../../translation/data";
import { Fade } from "react-reveal";

const get_recomendations = (callback, id, router, SESSIONID) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderAdvices/" +
        id +
        "?SESSIONID=" +
        SESSIONID
      // {
      //   auth: auth_data,
      // }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WorkorderAdvices } = Response;

      callback(WorkorderAdvices.data);
    })
    .catch(function (error) {
      console.log(error);
      // router.push("/login");
    });
};

const set_recomendations = (
  callback,
  id,
  SESSIONID,
  changedRecomendations,
  setMessage,
  recomendations,
  currentKey,
  setLoadDebounce
) => {
  const ADVICE_ID = changedRecomendations.ADVICE_ID;

  setLoadDebounce(false);

  axios
    .post(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderAdvice/" +
        id +
        (ADVICE_ID ? "/" + ADVICE_ID : "") +
        "?SESSIONID=" +
        SESSIONID +
        "&Formats=1",
      changedRecomendations,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;

      const { Response, Message } = result;
      const { WorkorderAdvice } = Response;

      if (Message == "Ok") {
        // console.log("success  status", changedRecomendations);
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);

        callback(
          recomendations.map((e, key) =>
            changedRecomendations.ADVICE_TEXT == e.ADVICE_TEXT &&
            currentKey == key
              ? WorkorderAdvice.data
              : e
          )
        );
        // callback([]);
      } else {
        console.log("error ok status", result);
        setMessage({ type: "error", text: "error", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
      }

      setLoadDebounce(true);
    })
    .catch(function (error) {
      console.log(error);
      setMessage({ type: "error", text: "error", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2500);
      setLoadDebounce(true);
    });
};

const delete_recomendation = (
  callback,
  id,
  SESSIONID,
  ADVICE_ID,
  recomendations,
  setMessage
) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderAdvice/" +
        id +
        "/" +
        ADVICE_ID +
        "?SESSIONID=" +
        SESSIONID,
      {
        headers: {
          "Content-type": "application/json",
          // "Content-type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Message } = result;

      if (Message == "Ok")
        callback(recomendations.filter((f) => f.ADVICE_ID != ADVICE_ID));
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

const delete_recomendations = (callback, id, SESSIONID, setMessage) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderAdvices/" +
        id +
        "?SESSIONID=" +
        SESSIONID +
        "&Formats=1"
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Message } = result;
      if (Message == "Ok") {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback([]);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const addNew = (recomendations, setRecomendations, recomendations_struct) => {
  const titles = recomendations_struct.map((s) => {
    return s.slug;
  });
  let empty_object = {};
  titles.forEach((key, index) => {
    empty_object[`${key}`] = "";
  });

  setRecomendations([...recomendations, empty_object]);
};

const Recomendation = (props) => {
  const {
    SESSIONID,
    refresh,
    status,
    debonceTime,
    save_date,
    save_state,
    setSaveState,
  } = props;
  const router = useRouter();

  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [changedStringId, setChangedStringId] = useState(0);

  const [recomendations, setRecomendations] = useState([]);

  const [message, setMessage] = useState({});
  const [temp_recomendations, setTempRecomendations] = useState([]);

  const [loadDebounce, setLoadDebounce] = useState(true);
  let tempArr = recomendations;

  const lastAdded = useRef(null);
  useEffect(() => {
    if (lastAdded.current) lastAdded.current.focus();
  }, [recomendations]);

  const debouncedSearchTerm = useDebounce(temp_recomendations, debonceTime);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id) {
      // if (addNewStringFlag) {
      //   setAddNewStringFlag(0);
      //   return;
      // }

      if (save_state.recomendation) {
        if (recomendations[changedStringId]) {
          let changedRecomendations = recomendations[changedStringId];
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          changedRecomendations["ADVICE_FIX_BEFORE"] = changedRecomendations[
            "ADVICE_FIX_BEFORE"
          ]
            ? changedRecomendations["ADVICE_FIX_BEFORE"]
            : formatDateForPost(date);

          if (changedRecomendations["ADVICE_TEXT"])
            set_recomendations(
              setRecomendations,
              router.query.id,
              SESSIONID,
              changedRecomendations,
              setMessage,
              recomendations,
              changedStringId,
              setLoadDebounce
            );

          setSaveState({
            ...save_state,
            recomendation: false,
          });
        }
      }
    }
  }, [debouncedSearchTerm, save_date]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_recomendations(setRecomendations, router.query.id, router, SESSIONID);
  }, [router, SESSIONID, refresh]);

  // console.log("recomendations", recomendations);
  return (
    <>
      {message.show ? <MessageToast {...message} /> : <></>}
      <Section className="text-center mb-1">
        <FlexBlock
          className="text-left w500 headerTableList"
          justify="space-between"
        >
          {t("recommendation")}
          {status != 2 && recomendations.length ? (
            <Fade>
              <Block
                className="text-left btn btn-link delAllLink"
                onClick={() => {
                  if (recomendations.length)
                    if (confirm(t("delete_all_confirm"))) {
                      delete_recomendations(
                        setRecomendations,
                        router.query.id,
                        SESSIONID,
                        setMessage
                      );
                    }
                }}
              >
                {t("delete_all")}
              </Block>
            </Fade>
          ) : (
            <></>
          )}
        </FlexBlock>

        <Table className="relative">
          <thead>
            <tr>
              {recomendations_struct.map((e, k) =>
                e.type != "hidden" ? (
                  <th scope="col" key={k} style={e.style ? e.style : {}}>
                    {t(e.t)}
                  </th>
                ) : (
                  <></>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {recomendations.map((recomendation, key) => (
              <>
                <tr key={key}>
                  {recomendations_struct.map((struct, k) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() + 1);
                    return struct.type != "hidden" ? (
                      <td scope="col" className="datapicker-top-left" key={k}>
                        <FlexBlock style={{}}>
                          {status != 2 ? (
                            struct.type == "date" ? (
                              <>
                                <DataInput
                                  callback={(e) => {
                                    if (loadDebounce) {
                                      tempArr[key][
                                        struct.slug
                                      ] = formatDateForPost(e);

                                      setTempRecomendations([...tempArr]);
                                      setChangedStringId(key);

                                      setSaveState({
                                        ...save_state,
                                        recomendation: true,
                                      });
                                    }
                                  }}
                                  noreload
                                  value={recomendation[struct.slug]}
                                  defaultDate={date}
                                  ref={
                                    k == 0 && key == recomendations.length - 1
                                      ? lastAdded
                                      : null
                                  }
                                />
                              </>
                            ) : (
                              <input
                                value={recomendation[struct.slug]}
                                className="form-control"
                                placehorder="repair order"
                                readOnly={!loadDebounce ? true : false}
                                onChange={(e) => {
                                  if (loadDebounce) {
                                    tempArr[key][struct.slug] = e.target.value;

                                    setTempRecomendations([...tempArr]);
                                    setChangedStringId(key);

                                    setSaveState({
                                      ...save_state,
                                      recomendation: true,
                                    });
                                  }
                                }}
                                ref={
                                  k == 0 && key == recomendations.length - 1
                                    ? lastAdded
                                    : null
                                }
                              />
                            )
                          ) : (
                            <FlexBlock style={{}}>
                              {struct.type == "date"
                                ? formatDateForView(recomendation[struct.slug])
                                : recomendation[struct.slug]}
                            </FlexBlock>
                          )}
                          {struct.required ? (
                            <Block className="requiredBlock"></Block>
                          ) : (
                            ""
                          )}
                        </FlexBlock>
                      </td>
                    ) : (
                      <></>
                    );
                  })}
                </tr>
                <tr>
                  <td className="strTr">
                    {status != 2 ? (
                      <Button
                        size="sm"
                        variant="danger"
                        title={"Delete "}
                        className={
                          "deleteNewString " +
                          (!loadDebounce ? "loadDebounce" : "")
                        }
                        onClick={() => {
                          if (confirm(" Are you sure want to delete record?")) {
                            if (recomendation["ADVICE_ID"])
                              delete_recomendation(
                                setRecomendations,
                                router.query.id,
                                SESSIONID,
                                recomendation["ADVICE_ID"],
                                recomendations
                              );
                            else {
                              setRecomendations(
                                recomendations.filter((f, k) => k != key)
                              );
                            }
                          }
                        }}
                      >
                        ✕
                      </Button>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              </>
            ))}
            <tr>
              {recomendations_struct.map((struct, key) =>
                struct.type != "hidden" ? (
                  <td scope="col" key={key}>
                    <Block style={{ opacity: 0 }}>1</Block>
                  </td>
                ) : (
                  <></>
                )
              )}
            </tr>
          </tbody>
          {status != 2 ? (
            <Button
              size="sm"
              variant="success"
              title="Add new"
              className={
                "addNewString " + (!loadDebounce ? "loadDebounce" : "")
              }
              onClick={() => {
                if (loadDebounce) {
                  setAddNewStringFlag(1);
                  addNew(
                    recomendations,
                    setRecomendations,
                    recomendations_struct
                  );
                }
              }}
            >
              +
            </Button>
          ) : (
            <></>
          )}
        </Table>
      </Section>
    </>
  );
};

export default Recomendation;
