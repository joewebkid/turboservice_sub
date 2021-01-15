import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { materials as materials_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import useDebounce from "../../atoms/FilterInput/useDebounce";
import MessageToast from "./MessageToast";

const get_parts = (callback, id, SESSIONID) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractParts/" +
        id +
        "?SESSIONID=" +
        SESSIONID
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WorkorderContractParts } = Response;

      callback(WorkorderContractParts.data);
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
};

const delete_materials = (callback, id, SESSIONID, setMessage) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractParts/" +
        id +
        "?SESSIONID=" +
        SESSIONID,
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
      const { Message } = Response;
      if (Message == "Ok") {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback(WorkorderContractJobs.data);
      }
    })
    .catch(function (error) {
      setMessage({ type: "error", text: "error", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2500);
      console.log(error);
    });
};

const set_materials = (
  callback,
  id,
  SESSIONID,
  changedMaterials,
  setMessage,
  materials
) => {
  const PART_ID = changedMaterials.PART_ID;

  axios
    .post(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractPart/" +
        id +
        (PART_ID ? "/" + PART_ID : "") +
        "?SESSIONID=" +
        SESSIONID,
      changedMaterials,
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
      const { WorkorderContractPart } = Response;
      if (Message == "Ok") {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback(
          materials.map((e) =>
            changedMaterials.PART_NAME == e.PART_NAME
              ? WorkorderContractPart.data
              : e
          )
        );
        // callback([]);
      } else {
        setMessage({ type: "error", text: "error", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
      }
    })
    .catch(function (error) {
      console.log(error);
      setMessage({ type: "error", text: "error", show: true });
      setTimeout(() => {
        setMessage({});
      }, 2500);
      console.log(error);
    });
};

const delete_material = (callback, id, SESSIONID, PART_ID, materials) => {
  axios
    .delete(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractPart/" +
        id +
        "/" +
        PART_ID +
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
        callback(materials.filter((f) => f.PART_ID != PART_ID));
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
};

const addNew = (materials, setMaterials, materials_struct) => {
  const titles = materials_struct.map((s) => {
    return s.slug;
  });
  let empty_object = {};
  titles.forEach((key, index) => {
    empty_object[`${key}`] = "";
  });

  setMaterials([...materials, empty_object]);
};

const MaterialsSection = (props) => {
  const { SESSIONID, refresh, status } = props;
  const router = useRouter();
  let material_sum = {};

  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [changedStringId, setChangedStringId] = useState(0);
  const [message, setMessage] = useState({});
  const [materials, setMaterials] = useState([]);
  const [temp_materials, setTempMaterials] = useState([]);
  let tempArr = materials;

  const debouncedSearchTerm = useDebounce(temp_materials, 500);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id) {
      if (addNewStringFlag) {
        setAddNewStringFlag(0);
        return;
      }

      if (materials[changedStringId]) {
        const changedMaterials = materials[changedStringId];
        const isFull = !Object.keys(changedMaterials).find(
          (e) => e != "PART_ID" && !changedMaterials[e]
        );

        if (isFull)
          set_materials(
            setMaterials,
            router.query.id,
            SESSIONID,
            changedMaterials,
            setMessage,
            materials
          );
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_parts(setMaterials, router.query.id, SESSIONID);
  }, [router, refresh]);
  // console.log("materials", materials);

  return (
    <>
      {message.show ? <MessageToast {...message} /> : <></>}
      <Section className="text-center mb-1">
        <FlexBlock className="text-left w500" justify="space-between">
          Spare parts and materials
          {status != 2 ? (
            <Block
              className="text-left btn btn-link"
              onClick={() => {
                delete_materials(
                  console.log,
                  router.query.id,
                  SESSIONID,
                  setMessage
                );
              }}
            >
              Удалить все
            </Block>
          ) : (
            <></>
          )}
        </FlexBlock>
        <Table className="relative">
          <thead>
            <tr>
              {materials_struct.map((e) =>
                e.type != "hidden" ? <th scope="col">{e.title}</th> : <></>
              )}
            </tr>
          </thead>
          <tbody>
            {materials.map((material, key) => (
              <>
                <tr>
                  {materials_struct.map((struct) => {
                    if (!material_sum[struct.slug])
                      material_sum[struct.slug] = 0;
                    material_sum[struct.slug] =
                      material_sum[struct.slug] + Number(material[struct.slug]);

                    return struct.type != "hidden" ? (
                      <td scope="col">
                        {status != 2 ? (
                          <input
                            value={material[struct.slug]}
                            className="form-control"
                            placehorder="repair order"
                            style={struct.style}
                            onChange={(e) => {
                              tempArr[key][struct.slug] = e.target.value;

                              // set_job(console.log, router.query.id, SESSIONID);
                              setTempMaterials([...tempArr]);
                              setChangedStringId(key);
                            }}
                          />
                        ) : (
                          <FlexBlock
                            style={{
                              width: 198,
                              float: "right",
                              paddingLeft: 10,
                            }}
                          >
                            {material[struct.slug]}
                          </FlexBlock>
                        )}
                      </td>
                    ) : (
                      <></>
                    );
                  })}
                </tr>
                {status != 2 ? (
                  <tr>
                    <td className="strTr">
                      <Button
                        size="sm"
                        variant="danger"
                        title={"Delete " + material["PART_NAME"]}
                        className="deleteNewString"
                        onClick={() => {
                          // console.log("er");
                          delete_material(
                            setMaterials,
                            router.query.id,
                            SESSIONID,
                            material["PART_ID"],
                            materials
                          );
                          // setAddNewStringFlag(1);
                          // addNew(jobs, setJobs, jobs_struct);
                        }}
                      >
                        ✕
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <></>
                )}
              </>
            ))}
            <tr>
              {materials_struct.map((struct) =>
                struct.type != "hidden" ? (
                  <td scope="col">
                    <Block className={struct.hide ? "d-none" : "show"}>
                      {material_sum[struct.slug]}
                    </Block>
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
              className="addNewString"
              onClick={() => {
                setAddNewStringFlag(1);
                addNew(materials, setMaterials, materials_struct);
              }}
            >
              +
            </Button>
          ) : (
            <></>
          )}
        </Table>
        <FlexBlock justify="flex-end">
          <Table bordered style={{ maxWidth: 230, marginBottom: 0 }}>
            <thead>
              <tr>
                <th scope="col" style={{ width: "40%" }}>
                  Total
                </th>
                <th scope="col" style={{ width: "40%" }}>
                  0
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">VAT</th>
                <td>0</td>
              </tr>
              <tr>
                <th scope="row">Grand Total</th>
                <td>0</td>
              </tr>
            </tbody>
          </Table>
        </FlexBlock>
      </Section>
    </>
  );
};

export default MaterialsSection;
