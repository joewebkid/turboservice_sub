import React, { useEffect, useState } from "react";
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
        SESSIONID,
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
        console.log("success  status", changedRecomendations);
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback(
          recomendations.map((e, key) =>
            changedRecomendations.ADVICE_TEXT == e.ADVICE_TEXT &&
            currentKey == key
              ? // !changedRecomendations.ADVICE_ID
                WorkorderAdvice.data
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
  const { SESSIONID, refresh, status } = props;
  const router = useRouter();

  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [changedStringId, setChangedStringId] = useState(0);

  const [recomendations, setRecomendations] = useState([]);

  const [message, setMessage] = useState({});
  const [temp_recomendations, setTempRecomendations] = useState([]);

  const [loadDebounce, setLoadDebounce] = useState(true);
  let tempArr = recomendations;

  const debouncedSearchTerm = useDebounce(temp_recomendations, 500);

  useEffect(() => {
    console.log(recomendations[changedStringId]);
    if (SESSIONID && router && router.query && router.query.id) {
      if (addNewStringFlag) {
        setAddNewStringFlag(0);
        return;
      }

      if (recomendations[changedStringId]) {
        const changedRecomendations = recomendations[changedStringId];
        const isFull = !Object.keys(changedRecomendations).find(
          (e) => e != "ADVICE_ID" && !changedRecomendations[e]
        );

        if (isFull)
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
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_recomendations(setRecomendations, router.query.id, router, SESSIONID);
  }, [router, SESSIONID, refresh]);
  // console.log("recomendations", recomendations);
  return (
    <>
      {message.show ? <MessageToast {...message} /> : <></>}
      <Section className="text-center mb-1">
        <Block className="text-left w500">Recommendation</Block>

        <Table className="relative">
          <thead>
            <tr>
              {recomendations_struct.map((e, k) =>
                e.type != "hidden" ? (
                  <th scope="col" key={k} style={e.style ? e.style : {}}>
                    {e.title}
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
                  {recomendations_struct.map((struct, ik) => {
                    const date = new Date();
                    date.setMonth(date.getMonth() + 1);
                    return struct.type != "hidden" ? (
                      <td scope="col" className="datapicker-top-left" key={ik}>
                        {status != 2 ? (
                          struct.type == "date" ? (
                            <DataInput
                              callback={(e) => {
                                tempArr[key][struct.slug] = formatDateForPost(
                                  e
                                );

                                setTempRecomendations([...tempArr]);
                                setChangedStringId(key);
                              }}
                              value={recomendation[struct.slug]}
                              defaultDate={date}
                            />
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
                                }
                              }}
                            />
                          )
                        ) : (
                          <FlexBlock style={{}}>
                            {struct.type == "date"
                              ? formatDateForView(recomendation[struct.slug])
                              : recomendation[struct.slug]}
                          </FlexBlock>
                        )}
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
                          // setAddNewStringFlag(1);
                          // addNew(jobs, setJobs, jobs_struct);
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
