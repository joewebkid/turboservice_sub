import React from "react";
import { Table } from "react-bootstrap";
import FlexBlock from "../../atoms/FlexBlock";

const TimeInfoSection = () => {
  return (
    <Table style={{ maxWidth: 500 }}>
      <tbody>
        <tr>
          <th scope="row">Start jobs</th>

          <td>
            <FlexBlock justify="flex-end" style={{ position: "relative" }}>
              123123
            </FlexBlock>
          </td>
        </tr>
        <tr>
          <th scope="row">Estimated time end of jobs</th>

          <td>
            <FlexBlock justify="flex-end" style={{ position: "relative" }}>
              12313
            </FlexBlock>
          </td>
        </tr>
        <tr>
          <th scope="row">Jobs done</th>

          <td>
            <FlexBlock justify="flex-end" style={{ position: "relative" }}>
              123123
            </FlexBlock>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default TimeInfoSection;
