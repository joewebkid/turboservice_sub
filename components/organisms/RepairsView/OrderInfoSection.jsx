import { useState, useEffect } from "react";
import axios from "axios";
import { Button, DropdownButton, Dropdown, Table } from "react-bootstrap";
import useDebounce from "../../atoms/FilterInput/useDebounce";
import FlexBlock from "../../atoms/FlexBlock";
import { t } from "../../translation/data";
import WheelTight from "./WheelTight";

const get_types = (callback, SESSIONID) => {
  if (SESSIONID)
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/OrderTypesList/?SESSIONID=" +
          SESSIONID
        // {
        //   auth: auth_data,
        // }
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { OrderTypesList } = Response;

        callback(OrderTypesList.data);
      })
      .catch(function (error) {
        console.log(error);
      });
};

const OrderInfoSection = (props) => {
  const {
    order_info,
    id,
    SESSIONID,
    callback,
    debonceTime,
    save_date,
    save_state,
    setSaveState,
    saveData,
    status,
    type_cab,
  } = props;

  const [types, setTypes] = useState([]);
  const [order_info_section, SetOrderInfo] = useState(order_info);
  const [isFirstTime, setIsFirstTime] = useState(1);
  const [isFirstTimeTwo, setIsFirstTimeTwo] = useState(1);

  useEffect(() => {
    if (SESSIONID) get_types(setTypes, SESSIONID);
  }, [id, SESSIONID]);

  useEffect(() => {
    if (isFirstTimeTwo) {
      setIsFirstTimeTwo(0);
      return 0;
    }

    if (!save_state.header)
      setSaveState({
        ...save_state,
        header: true,
      });
  }, [order_info_section]);

  const debouncedSearchTerm = useDebounce(order_info_section, debonceTime);

  useEffect(() => {
    console.log(save_state);
    if (isFirstTime) {
      setIsFirstTime(0);
      return 0;
    }
    if (save_state.header) {
      setSaveState({
        ...save_state,
        header: false,
      });
      callback(order_info_section);
    }
  }, [debouncedSearchTerm, save_date]);

  return (
    <>
      {order_info_section ? (
        <Table style={{ maxWidth: 500 }} className="text-left">
          <tbody>
            {/* WORKORDER NUMBER */}
            {type_cab == "orders" ? (
              <tr>
                <th scope="row">{t("contractor_repair_order")}</th>

                <td>
                  <FlexBlock
                    justify="flex-end"
                    style={{ position: "relative" }}
                  >
                    {status != 2 ? (
                      <input
                        value={order_info_section["CONTRACTOR_WORKORDER"] || ""}
                        className="form-control"
                        placehorder="repair order"
                        onChange={(e) => {
                          SetOrderInfo({
                            ...order_info,
                            CONTRACTOR_WORKORDER: e.target.value,
                          });
                        }}
                      />
                    ) : (
                      <FlexBlock
                        style={{
                          width: 198,
                          float: "left",
                          paddingLeft: 10,
                        }}
                      >
                        {order_info_section["CONTRACTOR_WORKORDER"] || ""}
                      </FlexBlock>
                    )}
                  </FlexBlock>
                </td>
              </tr>
            ) : (
              <></>
            )}
            <tr>
              <th scope="row">{t("milage")}</th>

              <td>
                <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                  {status != 2 ? (
                    <input
                      value={
                        Number(order_info_section["VEHICLE_MILEAGE"]) || ""
                      }
                      className="form-control"
                      placehorder="repair order"
                      onChange={(e) =>
                        SetOrderInfo({
                          ...order_info,
                          VEHICLE_MILEAGE: Number(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <FlexBlock
                      style={{
                        width: 198,
                        float: "left",
                        paddingLeft: 10,
                      }}
                    >
                      {Number(order_info_section["VEHICLE_MILEAGE"]) || ""}
                    </FlexBlock>
                  )}
                </FlexBlock>
              </td>
            </tr>
            <tr>
              <th scope="row">{t("order_type")}</th>

              <td>
                {status != 2 ? (
                  types[0] ? (
                    <FlexBlock
                      justify="flex-end"
                      style={{ position: "relative" }}
                    >
                      <DropdownButton
                        menuAlign="right"
                        title={
                          order_info_section["ORDER_TYPE_NAME"] ||
                          types[0].ORDER_TYPE_NAME
                        }
                        id="dropdown-menu-align-right"
                      >
                        {types.map((t, k) => {
                          return (
                            <Dropdown.Item
                              eventKey={t.ORDER_TYPE_ID}
                              key={k}
                              onClick={(e) => {
                                // console.log(e.target.innerText);
                                SetOrderInfo({
                                  ...order_info,
                                  ORDER_TYPE_ID: t.ORDER_TYPE_ID,
                                  ORDER_TYPE_NAME: e.target.innerText,
                                });

                                saveData();
                              }}
                              active={
                                t.ORDER_TYPE_ID ==
                                order_info_section["ORDER_TYPE_ID"]
                              }
                            >
                              {t.ORDER_TYPE_NAME}
                            </Dropdown.Item>
                          );
                        })}
                      </DropdownButton>
                    </FlexBlock>
                  ) : (
                    <></>
                  )
                ) : (
                  <FlexBlock
                    justify="flex-end"
                    style={{ position: "relative" }}
                  >
                    <FlexBlock
                      style={{
                        width: 198,
                        float: "left",
                        paddingLeft: 10,
                      }}
                    >
                      {order_info_section["ORDER_TYPE_NAME"]}
                    </FlexBlock>
                  </FlexBlock>
                )}
              </td>
            </tr>

            {/* WHEEL TIGHTENING TYPE */}
            {type_cab == "orders" ? (
              <tr>
                <th scope="row">{t("wheels_tightening_required")}</th>
                <td>
                  {status != 2 ? (
                    <FlexBlock
                      justify="flex-end"
                      style={{ position: "relative" }}
                    >
                      <WheelTight
                        id={id}
                        SESSIONID={SESSIONID}
                        order_info_section={order_info_section}
                        order_info={order_info}
                        SetOrderInfo={SetOrderInfo}
                        saveData={saveData}
                      />
                    </FlexBlock>
                  ) : (
                    <FlexBlock
                      justify="flex-end"
                      style={{ position: "relative" }}
                    >
                      <FlexBlock
                        style={{
                          width: 198,
                          float: "left",
                          paddingLeft: 10,
                        }}
                      >
                        {order_info_section["WHEEL_TIGHTENING_TASK_NAME"]}
                      </FlexBlock>
                    </FlexBlock>
                  )}
                </td>
              </tr>
            ) : (
              <></>
            )}
          </tbody>
        </Table>
      ) : (
        <></>
      )}
    </>
  );
};

export default OrderInfoSection;
