import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { materials as materials_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import useDebounce from "../../atoms/FilterInput/useDebounce";

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

const set_materials = (callback, id, SESSIONID, changedMaterials) => {
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
      const { Response } = result;
      const { WorkorderContractPart } = Response;

      callback(WorkorderContractPart.data);
    })
    .catch(function (error) {
      console.log(error);
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
  const { SESSIONID } = props;
  const router = useRouter();
  let material_sum = {};

  const [addNewStringFlag, setAddNewStringFlag] = useState(1);
  const [changedStringId, setChangedStringId] = useState(0);
  const [materials, setMaterials] = useState([]);
  let tempArr = materials;

  const debouncedSearchTerm = useDebounce(materials, 500);

  useEffect(() => {
    console.log(materials[changedStringId]);
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
            console.log,
            router.query.id,
            SESSIONID,
            changedMaterials
          );
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_parts(setMaterials, router.query.id, SESSIONID);
  }, [router]);
  // console.log("materials", materials);

  return (
    <>
      <Section className="text-center mb-1">
        <Block className="text-left w500">Spare parts and materials</Block>
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
              <tr>
                {materials_struct.map((struct) => {
                  if (!material_sum[struct.slug]) material_sum[struct.slug] = 0;
                  material_sum[struct.slug] =
                    material_sum[struct.slug] + Number(material[struct.slug]);

                  return struct.type != "hidden" ? (
                    <td scope="col">
                      <input
                        value={material[struct.slug]}
                        className="form-control"
                        placehorder="repair order"
                        style={struct.style}
                        onChange={(e) => {
                          tempArr[key][struct.slug] = e.target.value;

                          // set_job(console.log, router.query.id, SESSIONID);
                          setMaterials([...tempArr]);
                          setChangedStringId(key);
                        }}
                      />
                    </td>
                  ) : (
                    <></>
                  );
                })}
              </tr>
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
