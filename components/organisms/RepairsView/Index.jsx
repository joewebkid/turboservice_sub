import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import FlexBlock from "../../atoms/FlexBlock";
import Section from "../../atoms/Section";
// import JobsSection from "./JobsSection";
import OrderInfoSection from "./OrderInfoSection";
import RequestSection from "./RequestSection";
import TimeInfoSection from "./TimeInfoSection";
import TopSection from "./TopSection";
import MaterialsSection from "./MaterialsSection";
import Recomendation from "./Recomendation";
import Attached from "./Attached";
import { useRouter } from "next/router";
// import Fade from "react-reveal/Fade";
import axios from "axios";
import { formatDateForPost } from "../../molecules/data";
// import XMLData from "./repair_data.xml";
// import repair_data
// import { XMLParser } from "react-xml-parser";
// var XMLParser = require('react-xml-parser');
import dynamic from "next/dynamic";

const JobsSection = dynamic(() => import("./JobsSection"), { ssr: false });

const set_order_info = (
  callback,
  id,
  router,
  SESSIONID,
  order_info,
  flag_action
) => {
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
      if (flag_action == "done") {
        router.push("/");
      } else {
        callback(WorkorderHeader.data);
      }
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
        // else router.push("/login?session");
      })
      .catch(function (error) {
        // console.log(error);
        if (error.response && error.response.status == 401) {
          router.push("/login?session");
        }
      });
};

const Index = (props) => {
  const { SESSIONID } = props;
  const router = useRouter();

  const [order_info, setOrderInfo] = useState(false);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  // const [order_info, setOrderInfo] = useState([]);

  useEffect(() => {
    if (SESSIONID && router && router.query.id) {
      get_order_info(setOrderInfo, router.query.id, router, SESSIONID);
    }
  }, [router, SESSIONID]);

  if (!order_info)
    return (
      <Section className="loadscreen">
        <Spinner animation="grow" />
      </Section>
    );

  return (
    <>
      {order_info ? (
        <>
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
              if (confirm("Are you sure you want to finish this order?")) {
                set_order_info(
                  setOrderInfo,
                  router.query.id,
                  router,
                  SESSIONID,
                  {
                    ...order_info,
                    ORDER_STATUS_ID: 2,
                    ORDER_STATUS_NAME: "COMPLETED",
                    JOBS_DONE_DATE: formatDateForPost(),
                  },
                  "done"
                );
              } else {
                // alert("Вы нажали кнопку отмена");
              }
            }}
            status={order_info["ORDER_STATUS_ID"]}
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
              status={order_info["ORDER_STATUS_ID"]}
            />
            {/* Start time, Estimated and jobs done time */}
            <TimeInfoSection
              order_info={order_info}
              SESSIONID={SESSIONID}
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
              status={order_info["ORDER_STATUS_ID"]}
            />
          </FlexBlock>
          {/* Jobs list */}
          <JobsSection
            SESSIONID={SESSIONID}
            refreshPage={() => setRefresh(refresh + 1)}
            refresh={refresh}
            status={order_info["ORDER_STATUS_ID"]}
            setTotal={setTotal}
          />
          {/* Spare parts and materials */}
          <MaterialsSection
            SESSIONID={SESSIONID}
            refresh={refresh}
            status={order_info["ORDER_STATUS_ID"]}
            total={total}
            setTotal={setTotal}
          />
          {/* Recomendation lists */}
          <Recomendation
            SESSIONID={SESSIONID}
            refresh={refresh}
            status={order_info["ORDER_STATUS_ID"]}
          />
          {/* Attached files list */}
          <Attached
            SESSIONID={SESSIONID}
            refresh={refresh}
            status={order_info["ORDER_STATUS_ID"]}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Index;
