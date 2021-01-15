import { useState, useEffect } from "react";
import axios from "axios";
import { Button, DropdownButton, Dropdown, Table } from "react-bootstrap";
import useDebounce from "../../atoms/FilterInput/useDebounce";
import FlexBlock from "../../atoms/FlexBlock";

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

  useEffect(() => {
    if (SESSIONID) get_types(setTypes, SESSIONID);
  }, [id, SESSIONID]);

  const debouncedSearchTerm = useDebounce(order_info_section, 500);

  useEffect(() => {
    callback(order_info_section);
  }, [debouncedSearchTerm]);

  return (
    <>
      <Table style={{ maxWidth: 500 }}>
        <tbody>
          <tr>
            <th scope="row">Contractor repair order #</th>

            <td>
              <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                {status != 2 ? (
                  <input
                    value={order_info_section["CONTRACTOR_WORKORDER"] || ""}
                    className="form-control"
                    placehorder="repair order"
                    onChange={(e) =>
                      SetOrderInfo({
                        ...order_info,
                        CONTRACTOR_WORKORDER: e.target.value,
                      })
                    }
                  />
                ) : (
                  <FlexBlock
                    style={{
                      width: 198,
                      float: "right",
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
            <th scope="row">Milage</th>

            <td>
              <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                {status != 2 ? (
                  <input
                    value={order_info_section["VEHICLE_MILEAGE"] || ""}
                    className="form-control"
                    placehorder="repair order"
                    onChange={(e) =>
                      SetOrderInfo({
                        ...order_info,
                        VEHICLE_MILEAGE: e.target.value,
                      })
                    }
                  />
                ) : (
                  <FlexBlock
                    style={{
                      width: 198,
                      float: "right",
                      paddingLeft: 10,
                    }}
                  >
                    {order_info_section["VEHICLE_MILEAGE"] || ""}
                  </FlexBlock>
                )}
              </FlexBlock>
            </td>
          </tr>
          <tr>
            <th scope="row">Order type</th>

            <td>
              {types[0] ? (
                <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                  <DropdownButton
                    menuAlign="right"
                    title={types[0].ORDER_TYPE_NAME}
                    id="dropdown-menu-align-right"
                  >
                    {types.map((t, k) => {
                      return (
                        <Dropdown.Item
                          eventKey={t.ORDER_TYPE_ID}
                          key={k}
                          onClick={(e) => {
                            console.log(e.target.innerText);
                          }}
                        >
                          {t.ORDER_TYPE_NAME}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </FlexBlock>
              ) : (
                <></>
              )}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default OrderInfoSection;
