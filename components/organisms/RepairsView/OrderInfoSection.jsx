import { useState, useEffect } from "react";
import axios from "axios";
import { Button, DropdownButton, Dropdown, Table } from "react-bootstrap";
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
  const { order_info, id, SESSIONID } = props;

  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (SESSIONID) get_types(setTypes, SESSIONID);
  }, [id, SESSIONID]);

  return (
    <>
      <Table style={{ maxWidth: 500 }}>
        <tbody>
          <tr>
            <th scope="row">Contractor repair order #</th>

            <td>
              <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                <input
                  value={order_info["CONTRACTOR_WORKORDER"] || ""}
                  className="form-control"
                  placehorder="repair order"
                />
              </FlexBlock>
            </td>
          </tr>
          <tr>
            <th scope="row">Milage</th>

            <td>
              <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                <input
                  value={order_info["VEHICLE_MILEAGE"] || ""}
                  className="form-control"
                  placehorder="repair order"
                />
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
                        <Dropdown.Item eventKey={t.ORDER_TYPE_ID} key={k}>
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
