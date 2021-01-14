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

const set_recomendations = (callback, id, SESSIONID, changedRecomendations) => {
  const ADVICE_ID = changedRecomendations.ADVICE_ID;

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
      const { Response } = result;
      const { WorkorderAdvices } = Response;

      callback(WorkorderAdvices.data);
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
  const { SESSIONID } = props;
  const router = useRouter();

  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [changedStringId, setChangedStringId] = useState(0);
  const [recomendations, setRecomendations] = useState([]);
  let tempArr = recomendations;

  const debouncedSearchTerm = useDebounce(recomendations, 500);

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
            console.log,
            router.query.id,
            SESSIONID,
            changedRecomendations
          );
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_recomendations(setRecomendations, router.query.id, router, SESSIONID);
  }, [router, SESSIONID]);
  // console.log("recomendations", recomendations);
  return (
    <>
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
                  {recomendations_struct.map((struct, ik) =>
                    struct.type != "hidden" ? (
                      <td scope="col" key={ik}>
                        {struct.type == "date" ? (
                          <DataInput callback={console.log} />
                        ) : (
                          <input
                            value={recomendation[struct.slug]}
                            className="form-control"
                            placehorder="repair order"
                            onChange={(e) => {
                              tempArr[key][struct.slug] = e.target.value;

                              setRecomendations([...tempArr]);
                              setChangedStringId(key);
                            }}
                          />
                        )}
                      </td>
                    ) : (
                      <></>
                    )
                  )}
                </tr>
                <tr>
                  <td className="strTr">
                    <Button
                      size="sm"
                      variant="danger"
                      title="Add new"
                      className="deleteNewString"
                      onClick={() => {
                        console.log("er");
                        // setAddNewStringFlag(1);
                        // addNew(jobs, setJobs, jobs_struct);
                      }}
                    >
                      ✕
                    </Button>
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
          <Button
            size="sm"
            variant="success"
            title="Add new"
            className="addNewString"
            onClick={() => {
              setAddNewStringFlag(1);
              addNew(recomendations, setRecomendations, recomendations_struct);
            }}
          >
            +
          </Button>
        </Table>
      </Section>
    </>
  );
};

export default Recomendation;
