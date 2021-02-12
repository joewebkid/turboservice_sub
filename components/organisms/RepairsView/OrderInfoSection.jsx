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
  const { order_info, id, SESSIONID, callback } = props;
  const status = order_info["ORDER_STATUS_ID"];

  const [types, setTypes] = useState([]);
  const [order_info_section, SetOrderInfo] = useState(order_info);
  const [isFirstTime, setIsFirstTime] = useState(1);

  useEffect(() => {
    if (SESSIONID) get_types(setTypes, SESSIONID);
  }, [id, SESSIONID]);

  const debouncedSearchTerm = useDebounce(order_info_section, 500);

  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(0);
      return 0;
    }
    callback(order_info_section);
  }, [debouncedSearchTerm]);

  return (
    <>
      <Table style={{ maxWidth: 500 }} className="text-left">
        <tbody>
          <tr>
            <th scope="row">{t("contractor_repair_order")}</th>

            <td>
              <FlexBlock justify="flex-end" style={{ position: "relative" }}>
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
          <tr>
            <th scope="row">{t("milage")}</th>

            <td>
              <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                {status != 2 ? (
                  <input
                    value={Number(order_info_section["VEHICLE_MILEAGE"]) || ""}
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
                              console.log(e.target.innerText);
                              SetOrderInfo({
                                ...order_info,
                                ORDER_TYPE_ID: t.ORDER_TYPE_ID,
                                ORDER_TYPE_NAME: e.target.innerText,
                              });
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
                <FlexBlock justify="flex-end" style={{ position: "relative" }}>
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
          <tr>
            <th scope="row">Wheel tight</th>
            <td>
              {status != 2 ? (
                <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                  <WheelTight
                    id={id}
                    SESSIONID={SESSIONID}
                    order_info_section={order_info_section}
                    order_info={order_info}
                    SetOrderInfo={SetOrderInfo}
                  />
                </FlexBlock>
              ) : (
                <FlexBlock justify="flex-end" style={{ position: "relative" }}>
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
        </tbody>
      </Table>
    </>
  );
};

export default OrderInfoSection;
