import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { materials as materials_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";

const get_parts = (callback, id, SESSIONID, auth_data) => {
  axios
    .get(
      "https://zenon.basgroup.ru:55723/api-v2/Contractors/WorkorderParts/" +
        id +
        "?SESSIONID=" +
        SESSIONID,
      {
        auth: auth_data,
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WorkorderParts } = Response;

      callback(WorkorderParts.data);
      return response;
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
  const { SESSIONID, auth_data } = props;
  const router = useRouter();
  let material_sum = {};

  const [materials, setMaterials] = useState([]);
  let tempArr = materials;

  useEffect(() => {
    if (SESSIONID && auth_data && router && router.query && router.query.id)
      get_parts(setMaterials, router.query.id, SESSIONID, auth_data);
  }, [router, auth_data]);
  console.log("materials", materials);

  return (
    <>
      <Section className="text-center mb-1">
        <Block className="text-left w500">Spare parts and materials</Block>
        <Table className="relative">
          <thead>
            <tr>
              {materials_struct.map((e) => (
                <th scope="col">{e.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.map((material, key) => (
              <tr>
                {materials_struct.map((struct) => {
                  if (!material_sum[struct.slug]) material_sum[struct.slug] = 0;
                  material_sum[struct.slug] =
                    material_sum[struct.slug] + Number(material[struct.slug]);

                  return (
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
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              {materials_struct.map((struct) => (
                <td scope="col">
                  <Block className={struct.hide ? "d-none" : "show"}>
                    {material_sum[struct.slug]}
                  </Block>
                </td>
              ))}
            </tr>
          </tbody>
          <Button
            size="sm"
            variant="success"
            title="Add new"
            className="addNewString"
            onClick={() => addNew(materials, setMaterials, materials_struct)}
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
{
  /* <table class="table table-bordered table-responsive" style="max-width: 230px; margin-bottom: 0">
            <thead>
              <tr>
                <th scope="col" style="width: 40%">Total</th>
                <th scope="col" style="width: 40%">0</th>
              </tr>
            </thead>
            <tbody style=" width: 100%">
              <tr style="">
                <th scope="row">VAT</th>
                <td>0</td>
              </tr>
              <tr style="">
                <th scope="row">Grand Total</th>
                <td>5</td>
              </tr>
            </tbody>
          </table> */
}
