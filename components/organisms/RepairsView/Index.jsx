import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import FlexBlock from "../../atoms/FlexBlock";
import Section from "../../atoms/Section";
import JobsSection from "./JobsSection";
import OrderInfoSection from "./OrderInfoSection";
import RequestSection from "./RequestSection";
import TimeInfoSection from "./TimeInfoSection";
import TopSection from "./TopSection";
import MaterialsSection from "./MaterialsSection";
import Recomendation from "./Recomendation";
import Attached from "./Attached";
import { useRouter } from "next/router";
import Fade from "react-reveal/Fade";
import axios from "axios";
import { formatDateForPost } from "../../molecules/data";

const set_order_info = (callback, id, router, SESSIONID, order_info) => {
  axios
    .post(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderHeader/" +
        id +
        "?SESSIONID=" +
        SESSIONID,
      order_info
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WorkorderHeader } = Response;

      callback(WorkorderHeader.data);
    })
    .catch(function (error) {
      console.log(error);
      // router.push("/login?session");
    });
};

const get_order_info = (callback, id, router, SESSIONID) => {
  if (SESSIONID)
    axios
      .get(
        process.env.NEXT_PUBLIC_URL +
          "/api-v2/Contractors/WorkorderHeader/" +
          id +
          "?SESSIONID=" +
          SESSIONID
      )
      .then(function (response) {
        const { data } = response;
        const { result } = data;
        const { Response } = result;
        const { WorkorderHeader } = Response;

        if (WorkorderHeader.data) callback(WorkorderHeader.data);
        else router.push("/login?session");
      })
      .catch(function (error) {
        console.log(error);
        router.push("/login?session");
      });
};

const Index = (props) => {
  const { SESSIONID } = props;
  const router = useRouter();

  const [order_info, setOrderInfo] = useState(false);
  // const [order_info, setOrderInfo] = useState([]);

  useEffect(() => {
    if (SESSIONID && router && router.query.id)
      get_order_info(setOrderInfo, router.query.id, router, SESSIONID);
  }, [router, SESSIONID]);

  return (
    <>
      {order_info ? (
        <Fade>
          <TopSection order_info={order_info} />
          {/* Button group for order start and finish */}
          <RequestSection
            order_info={order_info}
            callback_start={() => {
              set_order_info(setOrderInfo, router.query.id, router, SESSIONID, {
                ...order_info,
                JOB_STARTED_DATE: formatDateForPost(),
              });
            }}
            callback_cancel={() => {
              set_order_info(setOrderInfo, router.query.id, router, SESSIONID, {
                ...order_info,
                JOB_STARTED_DATE: "",
              });
            }}
            callback_done={() => {
              set_order_info(setOrderInfo, router.query.id, router, SESSIONID, {
                ...order_info,
                // ORDER_STATUS_ID: 0,
                JOB_STARTED_DATE: formatDateForPost(),
                // CONTRACTOR_WORKORDER: "666",
              });
            }}
          />

          <FlexBlock justify="space-between" style={{ position: "relative" }}>
            {/* Type, order contactor id and milage */}
            <OrderInfoSection
              order_info={order_info}
              SESSIONID={SESSIONID}
              id={router.query.id}
              callback={(order_info_section) => {
                set_order_info(
                  setOrderInfo,
                  router.query.id,
                  router,
                  SESSIONID,
                  {
                    ...order_info,
                    ...order_info_section,
                  }
                );
              }}
            />
            {/* Start time, Estimated and jobs done time */}
            <TimeInfoSection order_info={order_info} SESSIONID={SESSIONID} />
          </FlexBlock>
          {/* Jobs list */}
          <JobsSection SESSIONID={SESSIONID} />
          {/* Spare parts and materials */}
          <MaterialsSection SESSIONID={SESSIONID} />
          {/* Recomendation lists */}
          <Recomendation SESSIONID={SESSIONID} />
          {/* Attached files list */}
          <Attached SESSIONID={SESSIONID} />
        </Fade>
      ) : (
        <></>
      )}
    </>
  );
};

export default Index;
