import React from "react";
import { Table } from "react-bootstrap";
import FlexBlock from "../../atoms/FlexBlock";

const TimeInfoSection = (props) => {
  const { order_info } = props;
  let JOB_STARTED_DATE = "";
  let EXPECTED_ISSUE_DATE = "";
  let JOBS_DONE_DATE = "";

  if (order_info["JOB_STARTED_DATE"]) {
    const d = new Date(order_info["JOB_STARTED_DATE"]);
    JOB_STARTED_DATE =
      d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
  }
  if (order_info["EXPECTED_ISSUE_DATE"]) {
    const d = new Date(order_info["EXPECTED_ISSUE_DATE"]);
    EXPECTED_ISSUE_DATE =
      d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
  }
  if (order_info["JOBS_DONE_DATE"]) {
    const d = new Date(order_info["JOBS_DONE_DATE"]);
    JOBS_DONE_DATE =
      d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
  }

  return (
    <Table style={{ maxWidth: 500 }}>
      <tbody>
        <tr>
          <th scope="row">Start jobs</th>

          <td>
            <FlexBlock justify="flex-end" style={{ position: "relative" }}>
              <input
                value={JOB_STARTED_DATE}
                className="form-control"
                placehorder=""
              />
            </FlexBlock>
          </td>
        </tr>
        <tr>
          <th scope="row">Estimated time end of jobs</th>

          <td>
            <FlexBlock justify="flex-end" style={{ position: "relative" }}>
              <input
                value={EXPECTED_ISSUE_DATE}
                className="form-control"
                placehorder=""
              />
            </FlexBlock>
          </td>
        </tr>
        <tr>
          <th scope="row">Jobs done</th>

          <td>
            <FlexBlock justify="flex-end" style={{ position: "relative" }}>
              <input
                value={JOBS_DONE_DATE}
                className="form-control"
                placehorder=""
              />
            </FlexBlock>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default TimeInfoSection;
