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
import MessageToast from "./MessageToast";
import Block from "../../atoms/Block";

const JobsSection = dynamic(() => import("./JobsSection"), { ssr: false });

const set_order_info = (
  callback,
  id,
  router,
  SESSIONID,
  order_info,
  flag_action,
  setMessage
) => {
  axios
    .post(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/Contractors/WorkorderHeader/" +
        id +
        "?SESSIONID=" +
        SESSIONID,
      {
        ...order_info,
        VEHICLE_MILEAGE: Number(order_info["VEHICLE_MILEAGE"]),
      }
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Response } = result;
      const { WorkorderHeader } = Response;

      if (flag_action == "done") {
        // console.log(WorkorderHeader);
        router.push("/");
      } else {
        setMessage({ type: "success", text: "success", show: true });
        setTimeout(() => {
          setMessage({});
        }, 2500);
        callback(WorkorderHeader.data);
      }
    })
    .catch(function (error) {
      if (error.response && error.response.status == 401) {
        router.push("/login?session&&redirectto=order/" + id);
      }
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
      });
};

const Index = (props) => {
  const { SESSIONID, user_info } = props;
  const router = useRouter();

  const [order_info, setOrderInfo] = useState(false);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState({});
  // console.log(jobsTotal);
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
      {message.show ? <MessageToast {...message} /> : <></>}
      {order_info ? (
        <>
          <Block>
            <Block className="box p-5 mb-3">
              <TopSection order_info={order_info} />
              {/* Button group for order start and finish */}

              <RequestSection
                order_info={order_info}
                callback_start={() => {
                  set_order_info(
                    setOrderInfo,
                    router.query.id,
                    router,
                    SESSIONID,
                    {
                      ...order_info,
                      JOB_STARTED_DATE: formatDateForPost(),
                    },
                    false,
                    setMessage
                  );
                }}
                callback_cancel={() => {
                  set_order_info(
                    setOrderInfo,
                    router.query.id,
                    router,
                    SESSIONID,
                    {
                      ...order_info,
                      JOB_STARTED_DATE: "",
                    },
                    false,
                    setMessage
                  );
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
            </Block>

            <Block className="box p-5 mb-3">
              <FlexBlock
                justify="space-between"
                style={{ position: "relative" }}
              >
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
                      },
                      false,
                      setMessage
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
                      },
                      false,
                      setMessage
                    );
                  }}
                  status={order_info["ORDER_STATUS_ID"]}
                />
              </FlexBlock>
            </Block>
            {/* Jobs list */}
            <Block className="box p-5 mb-3">
              <JobsSection
                SESSIONID={SESSIONID}
                refreshPage={() => setRefresh(refresh + 1)}
                refresh={refresh}
                status={order_info["ORDER_STATUS_ID"]}
                setTotal={setJobsTotal}
              />
              {/* Spare parts and materials */}
              <MaterialsSection
                SESSIONID={SESSIONID}
                refresh={refresh}
                status={order_info["ORDER_STATUS_ID"]}
                total={total}
                jobsTotal={jobsTotal}
                setTotal={setTotal}
                user_info={user_info}
              />
            </Block>
            {/* Recomendation lists */}
            <Block className="box p-5 mb-3">
              <Recomendation
                SESSIONID={SESSIONID}
                refresh={refresh}
                status={order_info["ORDER_STATUS_ID"]}
              />
            </Block>
            {/* Attached files list */}

            <Block className="box p-5 mb-3">
              <Attached
                SESSIONID={SESSIONID}
                refresh={refresh}
                status={order_info["ORDER_STATUS_ID"]}
              />
            </Block>
          </Block>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Index;
