import React from "react";
import { Button, DropdownButton, Dropdown, Table } from "react-bootstrap";
import FlexBlock from "../../atoms/FlexBlock";

const OrderInfoSection = () => {
  return (
    <>
      <Table style={{ maxWidth: 500 }}>
        <tbody>
          <tr>
            <th scope="row">Contractor repair order #</th>

            <td>
              <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                <input
                  value="25213"
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
                  value="H55NV"
                  className="form-control"
                  placehorder="repair order"
                />
              </FlexBlock>
            </td>
          </tr>
          <tr>
            <th scope="row">Order type</th>

            <td>
              <FlexBlock justify="flex-end" style={{ position: "relative" }}>
                <DropdownButton
                  menuAlign="right"
                  title="Contractor repair / To"
                  id="dropdown-menu-align-right"
                >
                  <Dropdown.Item eventKey="1">
                    Contractor repair / To
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                  <Dropdown.Item eventKey="3">
                    Something else here
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </DropdownButton>
              </FlexBlock>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default OrderInfoSection;
