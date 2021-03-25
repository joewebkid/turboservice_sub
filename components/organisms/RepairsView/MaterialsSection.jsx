import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Table, Button } from "react-bootstrap";
import Section from "../../atoms/Section";
import Block from "../../atoms/Block";
import { materials as materials_struct } from "./data";
import FlexBlock from "../../atoms/FlexBlock";
import useDebounce from "../../atoms/FilterInput/useDebounce";
import MessageToast from "./MessageToast";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import Fade from "react-reveal/Fade";
import { t } from "../../translation/data";

const get_parts = (callback, id, SESSIONID) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderContractParts/" +
        id +
        "?SESSIONID=" +
        SESSIONID +
        "&Formats=1"
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
      const { Message, Response } = result;
      if (Message == "Ok") {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback([]);
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
  materials,
  setLoadDebounce,
  setSavedComplete
) => {
  const PART_ID = changedMaterials.PART_ID;

  setLoadDebounce(false);

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
        setSavedComplete();
        // callback([]);
      } else {
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
      console.log(error);
      setLoadDebounce(true);
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

const addNew = (
  materials,
  setMaterials,
  materials_struct,
  user_info,
  setTempMaterials
) => {
  const titles = materials_struct.map((s) => {
    return s.slug;
  });
  let empty_object = {};
  titles.forEach((key, index) => {
    empty_object[`${key}`] =
      "PART_BRAND" == key && user_info.DEFAULT_BRAND
        ? user_info.DEFAULT_BRAND
        : materials_struct[index].default || "";
  });

  setMaterials([...materials, empty_object]);
  setTempMaterials([...materials, empty_object]);
};

const validation = (data, struct) => {
  let flag = true;
  data.map((e) => {
    struct.map((s) => {
      if (s.required && !e[s["slug"]]) flag = false;
    });
  });
  return flag;
};

const MaterialsSection = (props) => {
  const {
    SESSIONID,
    refresh,
    status,
    setTotal,
    total,
    jobsTotal,
    user_info,
    debonceTime,
    save_date,
    save_state,
    setSaveState,
    setValideState,
    valide_state,
    type_cab,
    saveData,
  } = props;
  const router = useRouter();
  let material_sum = {};

  const [addNewStringFlag, setAddNewStringFlag] = useState(0);
  const [changedStringId, setChangedStringId] = useState(false);
  const [message, setMessage] = useState({});
  const [materials, setMaterials] = useState([]);
  const [temp_materials, setTempMaterials] = useState([]);
  const [loadDebounce, setLoadDebounce] = useState(true);
  // const [isClearFilter, setIsClearFilter] = useState(true);

  const [changedIds, setChangedIds] = useState([]);

  const [savedIds, setSavedIds] = useState({});
  const debouncedValidate = useDebounce(temp_materials, 300);

  let tempArr = materials;

  const debouncedSearchTerm = useDebounce(temp_materials, debonceTime);

  const numberMask = createNumberMask({
    prefix: "",
    suffix: "",
    thousandsSeparatorSymbol: "",
    allowDecimal: true,
    decimalSymbol: ".",
    decimalLimit: 2,
  });

  const lastAdded = useRef(null);

  // useEffect(() => {
  //   console.log(temp_materials);
  // }, [temp_materials]);

  useEffect(() => {
    let data_for_valid = temp_materials;

    if (validation(data_for_valid, materials_struct)) {
      setValideState({ ...valide_state, material: true });
    } else setValideState({ ...valide_state, material: false });
  }, [debouncedValidate]);

  useEffect(() => {
    if (lastAdded.current && addNewStringFlag == 1) {
      lastAdded.current.focus();
      setAddNewStringFlag(0);
    }

    // if (changedStringId !== false)
    //   setChangedIds(
    //     [...changedIds, changedStringId].filter((value, index, self) => {
    //       return self.indexOf(value) === index;
    //     })
    //   );
  }, [materials, changedStringId]);

  // console.log(savedIds);
  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id) {
      // if (addNewStringFlag) {
      //   setAddNewStringFlag(0);
      //   return;
      // }

      if (save_state.material) {
        // setIsClearFilter(false);
        if (materials[changedStringId]) {
          // console.log(112312312323123);
          let savedIdsTemp = savedIds;
          changedIds.map((changedId) => {
            const isFull = !Object.keys(materials[changedId]).find(
              (e) =>
                e != "PART_ID" &&
                !materials[changedId][e] &&
                e != "PART_AMOUNT" &&
                e != "PART_PRICE"
            );
            if (isFull) savedIdsTemp = { ...savedIdsTemp, [changedId]: true };
          });
          setSavedIds(savedIdsTemp);

          changedIds.map((changedId) => {
            const changedMaterials = materials[changedId];
            const isFull = !Object.keys(changedMaterials).find(
              (e) =>
                e != "PART_ID" &&
                !changedMaterials[e] &&
                e != "PART_AMOUNT" &&
                e != "PART_PRICE"
            );
            // if (isFull) setSavedIds({ ...savedIds, [changedStringId]: true });

            if (isFull) {
              set_materials(
                setMaterials,
                router.query.id,
                SESSIONID,
                changedMaterials,
                setMessage,
                materials,
                setLoadDebounce,
                () => {
                  setSavedIds({ ...savedIds, [changedStringId]: false });
                }
              );
            }
          });

          setSaveState({
            ...save_state,
            material: false,
          });

          setChangedIds([]);
          setChangedStringId(false);
        }
      }
    }
  }, [debouncedSearchTerm, save_date]);

  useEffect(() => {
    setTotal(jobsTotal);
  }, [jobsTotal]);

  useEffect(() => {
    if (SESSIONID && router && router.query && router.query.id)
      get_parts(setMaterials, router.query.id, SESSIONID);
  }, [router, refresh]);
  // console.log("materials", materials);

  return (
    <>
      {message.show ? <MessageToast {...message} /> : <></>}
      <Section className="text-center mb-1">
        <FlexBlock
          className="text-left w500 headerTableList"
          justify="space-between"
        >
          {t("spare_parts_and_materials")}
          {status != 2 ? (
            <Block
              className="text-left btn btn-link delAllLink"
              onClick={() => {
                if (confirm(t("delete_all_confirm"))) {
                  delete_materials(
                    setMaterials,
                    router.query.id,
                    SESSIONID,
                    setMessage
                  );

                  setChangedIds([]);
                }
              }}
            >
              {t("delete_all")}
            </Block>
          ) : (
            <></>
          )}
        </FlexBlock>
        <Table className="relative">
          <thead>
            <tr>
              {materials_struct.map((e) =>
                e.type != "hidden" ? <th scope="col">{t(e.t)}</th> : <></>
              )}
              <th scope="col">{t("sum")}</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material, key) => {
              if (!material_sum["sum"]) material_sum["sum"] = 0;
              material_sum["sum"] =
                material_sum["sum"] +
                Number(material["PART_AMOUNT"]) *
                  Number(material["PART_PRICE"]);
              setTotal(jobsTotal + material_sum["sum"]);
              return (
                <>
                  <tr>
                    {materials_struct.map((struct, k) => {
                      const value = material[struct.slug];

                      if (struct.type == "number") {
                        if (!material_sum[struct.slug])
                          material_sum[struct.slug] = 0;

                        material_sum[struct.slug] =
                          Number(material_sum[struct.slug]) +
                          Number(material[struct.slug]);
                      }

                      // if (
                      //   material_sum != undefined &&
                      //   struct.slug == "PART_AMOUNT"
                      // )
                      return struct.type != "hidden" ? (
                        <td scope="col" key={k}>
                          <FlexBlock>
                            {status != 2 ? (
                              struct.type == "number" ? (
                                <MaskedInput
                                  mask={numberMask}
                                  value={value}
                                  className={
                                    "form-control " +
                                    (struct.required && value === ""
                                      ? "required"
                                      : "")
                                  }
                                  placehorder="repair order"
                                  style={struct.style}
                                  readOnly={
                                    !loadDebounce && savedIds[key]
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    // console.log(e.target.value);
                                    if (!savedIds[key]) {
                                      tempArr[key][struct.slug] =
                                        e.target.value;
                                      setMaterials([...tempArr]);
                                      setTempMaterials([...tempArr]);
                                      setChangedStringId(key);

                                      setSaveState({
                                        ...save_state,
                                        material: true,
                                      });

                                      setChangedIds(
                                        [...changedIds, key].filter(
                                          (value, index, self) => {
                                            return (
                                              self.indexOf(value) === index
                                            );
                                          }
                                        )
                                      );
                                    }
                                  }}
                                  ref={
                                    k == 0 && key == materials.length - 1
                                      ? lastAdded
                                      : null
                                  }
                                />
                              ) : (
                                <input
                                  value={value}
                                  className={
                                    "form-control " +
                                    (struct.required && value === ""
                                      ? "required"
                                      : "")
                                  }
                                  placehorder="repair order"
                                  style={struct.style}
                                  readOnly={
                                    !loadDebounce && savedIds[key]
                                      ? true
                                      : false
                                  }
                                  onChange={(e) => {
                                    // console.log("-=----");
                                    // console.log(savedIds);
                                    // console.log(key);
                                    // console.log(savedIds[key]);
                                    // console.log(!savedIds[key]);
                                    if (!savedIds[key]) {
                                      // set_material(console.log, router.query.id, SESSIONID);
                                      tempArr[key][struct.slug] =
                                        e.target.value;
                                      setChangedStringId(key);
                                      setMaterials([...tempArr]);
                                      setTempMaterials([...tempArr]);

                                      setSaveState({
                                        ...save_state,
                                        material: true,
                                      });

                                      setChangedIds(
                                        [...changedIds, key].filter(
                                          (value, index, self) => {
                                            return (
                                              self.indexOf(value) === index
                                            );
                                          }
                                        )
                                      );
                                    }
                                  }}
                                  ref={
                                    k == 0 && key == materials.length - 1
                                      ? lastAdded
                                      : null
                                  }
                                />
                              )
                            ) : (
                              <FlexBlock
                                style={{
                                  ...struct.style,
                                }}
                              >
                                {material[struct.slug]}
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
                    <td scope="col">
                      <FlexBlock style={{ paddingTop: status != 2 ? 7 : 0 }}>
                        {material["PART_AMOUNT"] * material["PART_PRICE"]
                          ? Number(
                              material["PART_AMOUNT"] * material["PART_PRICE"]
                            ).toFixed(2)
                          : "0.00"}
                      </FlexBlock>
                    </td>
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

                            if (confirm(t("sure_delete_record"))) {
                              if (!savedIds[key]) {
                                if (material["PART_ID"])
                                  delete_material(
                                    setMaterials,
                                    router.query.id,
                                    SESSIONID,
                                    material["PART_ID"],
                                    materials
                                  );
                                // else {
                                //   setMaterials(
                                //     materials.filter((f, k) => k != key)
                                //   );
                                // }
                                setMaterials(
                                  materials.filter((f, k) => k != key)
                                );
                                setTempMaterials(
                                  materials.filter((f, k) => k != key)
                                );

                                // setChangedIds([
                                //   ...changedIds.filter((id) => id != key),
                                // ]);
                              }
                            }
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
              );
            })}
            <tr>
              {materials_struct.map((struct) =>
                struct.type != "hidden" ? (
                  <td scope="col">
                    <Block
                      className={struct.hide ? "d-none" : "show"}
                      style={{}}
                    >
                      {material_sum[struct.slug]
                        ? Number(material_sum[struct.slug]).toFixed(2)
                        : "0.00"}
                    </Block>
                  </td>
                ) : (
                  <></>
                )
              )}
              <td>
                <Block style={{ paddingTop: status != 2 ? 7 : 0 }}>
                  {material_sum["sum"]
                    ? Number(material_sum["sum"]).toFixed(2)
                    : "0.00"}
                </Block>
              </td>
            </tr>
          </tbody>
          {status != 2 && validation(materials, materials_struct) ? (
            <Button
              size="sm"
              variant="success"
              title="Add new"
              className={
                "addNewString " + (!loadDebounce ? "loadDebounce" : "")
              }
              onClick={() => {
                if (loadDebounce) {
                  saveData();
                  setAddNewStringFlag(1);
                  addNew(
                    materials,
                    setMaterials,
                    materials_struct,
                    user_info,
                    setTempMaterials
                  );
                  setValideState({ ...valide_state, material: false });
                }
              }}
            >
              +
            </Button>
          ) : (
            <></>
          )}
        </Table>
        {type_cab == "orders" ? (
          <FlexBlock justify="flex-end">
            <Table bordered style={{ maxWidth: 230, marginBottom: 0 }}>
              <thead>
                <tr>
                  <th scope="col" style={{ width: "40%" }}>
                    {t("total")}
                  </th>
                  <th scope="col" style={{ width: "40%" }}>
                    {Number(total).toFixed(2)}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{t("vat")}</th>
                  <td>{Number(total * 0.2).toFixed(2)}</td>
                </tr>
                <tr>
                  <th scope="row">{t("grand_total")}</th>
                  <td>{Number(total + total * 0.2).toFixed(2)}</td>
                </tr>
              </tbody>
            </Table>
          </FlexBlock>
        ) : (
          <></>
        )}
      </Section>
    </>
  );
};

export default MaterialsSection;
