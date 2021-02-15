import React, { useEffect, useState } from "react";
import Block from "../../atoms/Block";
import { DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";
import { t } from "../../translation/data";

const set_wheel_tight = (callback, id, SESSIONID) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WheelTighteningTasksList/" +
        id +
        "?SESSIONID=" +
        SESSIONID
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WheelTighteningTasks } = Response;

      if (WheelTighteningTasks.data) callback(WheelTighteningTasks.data);

      //   if (flag_action == "done") {
      //     // console.log(WorkorderHeader);
      //     router.push("/");
      //   } else {
      //     setMessage({ type: "success", text: "success", show: true });
      //     setTimeout(() => {
      //       setMessage({});
      //     }, 2500);
      //     callback(WorkorderHeader.data);
      //   }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const WheelTight = (props) => {
  const { id, SESSIONID, order_info_section, SetOrderInfo, order_info } = props;
  const [wheel_tight, setwheel_tight] = useState(false);
  useEffect(() => {
    console.log(id, SESSIONID);
    if (SESSIONID && id) {
      set_wheel_tight(setwheel_tight, id, SESSIONID);
    }
  }, [id, SESSIONID]);

  return (
    <Block>
      {wheel_tight ? (
        <DropdownButton
          menuAlign="right"
          title={
            order_info_section["WHEEL_TIGHTENING_TASK_NAME"] ||
            t("please_select")
          }
          id="dropdown-menu-align-right"
        >
          {[
            {
              WHEEL_TIGHTENING_TASK_ID: null,
              WHEEL_TIGHTENING_TASK_NAME: t("please_select"),
            },
            ...wheel_tight,
          ].map((t, k) => {
            return (
              <Dropdown.Item
                eventKey={Number(t.WHEEL_TIGHTENING_TASK_ID)}
                key={k}
                onClick={(e) => {
                  SetOrderInfo({
                    ...order_info,
                    WHEEL_TIGHTENING_TASK_ID: t.WHEEL_TIGHTENING_TASK_ID,
                    WHEEL_TIGHTENING_TASK_NAME: e.target.innerText,
                  });
                }}
                active={
                  t.WHEEL_TIGHTENING_TASK_ID ==
                  order_info_section["WHEEL_TIGHTENING_TASK_ID"]
                }
              >
                {t.WHEEL_TIGHTENING_TASK_NAME}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      ) : (
        <></>
      )}
    </Block>
  );
};

export default WheelTight;
