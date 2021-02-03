import React from "react";
import FlexBlock from "../../atoms/FlexBlock";
import Block from "../../atoms/Block";

function StatusTabs(props) {
  const { statuses, selectStatus, setSelectStatus } = props;
  return (
    <FlexBlock className="statusTabs">
      {statuses.map((e) => (
        <Block
          className={
            "statusTab mr-2 " +
            (e.ORDER_STATUS_ID == selectStatus ? "active" : "")
          }
          onClick={() => setSelectStatus(e.ORDER_STATUS_ID)}
        >
          {e.ORDER_STATUS_NAME}
        </Block>
      ))}
    </FlexBlock>
  );
}
// ORDER_STATUS_ID
export default StatusTabs;
