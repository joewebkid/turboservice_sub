import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { recomendation as recomendations_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";

const get_recomendations = (callback, id, router, SESSIONID, auth_data) => {
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
  const { SESSIONID, auth_data } = props;
  const router = useRouter();

  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [recomendations, setRecomendations] = useState([]);
  let tempArr = recomendations;

  useEffect(() => {
    if (SESSIONID && auth_data && router && router.query && router.query.id)
      get_recomendations(
        setRecomendations,
        router.query.id,
        router,
        SESSIONID,
        auth_data
      );
  }, [router, SESSIONID, auth_data]);
  // console.log("recomendations", recomendations);
  return (
    <>
      <Section className="text-center mb-1">
        <Block className="text-left w500">Recommendation</Block>

        <Table className="relative">
          <thead>
            <tr>
              {recomendations_struct.map((e, k) => (
                <th scope="col" key={k}>
                  {e.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recomendations.map((recomendation, key) => (
              <tr key={key}>
                {recomendations_struct.map((struct, ik) => (
                  <td scope="col" key={ik}>
                    <input
                      value={recomendation[struct.slug]}
                      className="form-control"
                      placehorder="repair order"
                      onChange={(e) => {
                        tempArr[key][struct.slug] = e.target.value;

                        // set_job(console.log, router.query.id, SESSIONID);
                        setRecomendations([...tempArr]);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              {recomendations_struct.map((struct, key) => (
                <td scope="col" key={key}>
                  <Block style={{ opacity: 0 }}>1</Block>
                </td>
              ))}
            </tr>
          </tbody>
          <Button
            size="sm"
            variant="success"
            title="Add new"
            className="addNewString"
            onClick={() =>
              addNew(recomendations, setRecomendations, recomendations_struct)
            }
          >
            +
          </Button>
        </Table>
      </Section>
    </>
  );
};

export default Recomendation;
