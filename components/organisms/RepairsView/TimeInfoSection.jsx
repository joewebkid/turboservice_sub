import React from "react";
import { Table } from "react-bootstrap";
import FlexBlock from "../../atoms/FlexBlock";
import Fade from "react-reveal/Fade";
import DataInput from "../../atoms/DataInput";
import { formatDateForPost, formatDateForView } from "../../molecules/data";
import { t } from "../../translations/data";

const TimeInfoSection = (props) => {
  const { order_info } = props;
  const status = order_info["ORDER_STATUS_ID"];
  return (
    <Table style={{ maxWidth: 500 }}>
      <tbody>
        <tr>
          <th scope="row">{t("start_jobs")}</th>

          <td className="datapicker-top-left right-215">
            {status != 0 ? (
              status != 2 ? (
                <FlexBlock justify="flex-end" style={{}}>
                  <DataInput
                    callback={(e) => {
                      props.callback({ JOB_STARTED_DATE: e });
                    }}
                    type="info"
                    value={order_info.JOB_STARTED_DATE}
                  />
                </FlexBlock>
              ) : (
                <FlexBlock
                  style={{ width: 198, float: "right", paddingLeft: 10 }}
                >
                  {formatDateForView(order_info.JOB_STARTED_DATE)}
                </FlexBlock>
              )
            ) : (
              <></>
            )}
          </td>
        </tr>
        <tr>
          <th scope="row">{t("estimated_time_end_of_jobs")}</th>

          <td className="datapicker-top-left right-215">
            {status != 2 ? (
              <FlexBlock justify="flex-end" style={{}}>
                <DataInput
                  callback={(e) => {
                    props.callback({ EXPECTED_ISSUE_DATE: e });
                  }}
                  type="info"
                  value={order_info.EXPECTED_ISSUE_DATE}
                />
                {/* <FlexBlock className="deleteBlockRight">
                  <FlexBlock
                    className="deleteLink delFilter"
                    onClick={() => {
                      props.callback({ EXPECTED_ISSUE_DATE: "" });
                    }}
                  >
                    ✕
                  </FlexBlock>
                </FlexBlock> */}
              </FlexBlock>
            ) : (
              <FlexBlock
                style={{ width: 198, float: "right", paddingLeft: 10 }}
              >
                {formatDateForView(order_info.EXPECTED_ISSUE_DATE)}
              </FlexBlock>
            )}
          </td>
        </tr>
        <tr>
          <th scope="row">{t("jobs_done")}</th>

          <td className="datapicker-top-left">
            <FlexBlock style={{ width: 198, float: "right", paddingLeft: 10 }}>
              {order_info.JOBS_DONE_DATE
                ? formatDateForView(order_info.JOBS_DONE_DATE)
                : ""}
            </FlexBlock>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default TimeInfoSection;
