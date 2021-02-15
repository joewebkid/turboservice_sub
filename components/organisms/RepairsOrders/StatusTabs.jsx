import React from "react";
import FlexBlock from "../../atoms/FlexBlock";
import Block from "../../atoms/Block";

function StatusTabs(props) {
  const { statuses, selectStatus, setSelectStatus, setCurrentPage } = props;
  return (
    <FlexBlock className="statusTabs">
      {statuses.map((e) => (
        <Block
          className={
            "statusTab mr-2 " +
            (e.ORDER_STATUS_ID == selectStatus ? "active" : "")
          }
          onClick={() => {
            setSelectStatus(e.ORDER_STATUS_ID);
            setCurrentPage(0);

            localStorage.setItem("current_page", 0);
          }}
        >
          {e.ORDER_STATUS_NAME}
        </Block>
      ))}
    </FlexBlock>
  );
}
// ORDER_STATUS_ID
export default StatusTabs;
