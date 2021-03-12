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
import { t } from "../../translation/data";

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

const get_order_info = (callback, id, router, SESSIONID, setOrderStatus) => {
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

        if (WorkorderHeader.data) {
          callback(WorkorderHeader.data);
          setOrderStatus(WorkorderHeader.data.ORDER_STATUS_ID);
        }
        // else router.push("/login?session");
      })
      .catch(function (error) {
        if (error.response && error.response.status == 401) {
          router.push("/login?session&&redirectto=order/" + id);
        }
      });
};

const Index = (props) => {
  const {
    SESSIONID,
    user_info,
    save_date,
    setOrderStatus,
    save_state,
    setSaveState,
    saveData,
    setValideState,
    valide_state,
    type_cab,
  } = props;
  const debonceTime = process.env.NEXT_PUBLIC_ORDER_DEBONCE
    ? Number(process.env.NEXT_PUBLIC_ORDER_DEBONCE)
    : 1000;
  const router = useRouter();

  const [order_info, setOrderInfo] = useState(false);
  const [jobsTotal, setJobsTotal] = useState(0);
  const [jobsNum, setJobsNum] = useState(0);
  const [jobsNumNotSaved, setJobsNumNotSaved] = useState(0);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState({});
  // console.log(jobsNum);
  // const [order_info, setOrderInfo] = useState([]);

  useEffect(() => {
    if (SESSIONID && router && router.query.id) {
      get_order_info(
        setOrderInfo,
        router.query.id,
        router,
        SESSIONID,
        setOrderStatus
      );
    }
  }, [router, SESSIONID]);

  if (!order_info)
    return (
      <Section className="loadscreen">
        <Spinner animation="grow" />
      </Section>
    );
  // console.log(type_cab == "vehicles" ? 2 : order_info["ORDER_STATUS_ID"]);
  // console.log(order_info["ORDER_STATUS_ID"]);
  const STATUS = type_cab == "vehicles" ? 2 : order_info["ORDER_STATUS_ID"];

  return (
    <>
      {/* <Block
        onClick={() => {
          saveData();
        }}
      >
        Save date
      </Block> */}
      {message.show ? <MessageToast {...message} /> : <></>}
      {order_info ? (
        <>
          <Block>
            <Block className="box p-5 mb-3">
              <TopSection order_info={order_info} debonceTime={debonceTime} />
              {/* Button group for order start and finish */}

              <RequestSection
                debonceTime={debonceTime}
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
                      EXPECTED_ISSUE_DATE: "",
                    },
                    false,
                    setMessage
                  );
                }}
                callback_done={() => {
                  if (
                    order_info["WHEEL_TIGHTENING_TASK_ID"] == 0 ||
                    order_info["WHEEL_TIGHTENING_TASK_ID"] == null
                  ) {
                    alert(t("wheels_tightening_error"));
                    return;
                  }

                  if (jobsNumNotSaved == 0) {
                    alert(t("please_add_job"));
                    return;
                  }

                  saveData();
                  // return;
                  if (
                    order_info["WHEEL_TIGHTENING_TASK_ID"] == 10
                      ? confirm(t("sure_finish_order_wheel_tight_no"))
                      : confirm(t("sure_finish_order"))
                  ) {
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
                  }
                }}
                status={STATUS}
              />
            </Block>

            <Block className="box p-5 mb-3">
              <FlexBlock
                justify="space-between"
                style={{ position: "relative" }}
              >
                {/* Type, order contactor id and milage */}
                <OrderInfoSection
                  debonceTime={debonceTime}
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
                  status={STATUS}
                  save_date={save_date}
                  save_state={save_state}
                  setSaveState={setSaveState}
                  saveData={saveData}
                />
                {/* Start time, Estimated and jobs done time */}
                <TimeInfoSection
                  debonceTime={debonceTime}
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
                  status={STATUS}
                  save_state={save_state}
                  setSaveState={setSaveState}
                />
              </FlexBlock>
            </Block>
            {/* Jobs list */}
            <Block className="box p-5 mb-3">
              <JobsSection
                debonceTime={debonceTime}
                SESSIONID={SESSIONID}
                refreshPage={() => setRefresh(refresh + 1)}
                refresh={refresh}
                status={STATUS}
                setTotal={setJobsTotal}
                save_date={save_date}
                save_state={save_state}
                setSaveState={setSaveState}
                setJobsNum={setJobsNum}
                setJobsNumNotSaved={setJobsNumNotSaved}
                setValideState={setValideState}
                valide_state={valide_state}
              />
              {/* Spare parts and materials */}
              <MaterialsSection
                debonceTime={debonceTime}
                SESSIONID={SESSIONID}
                refresh={refresh}
                status={STATUS}
                total={total}
                jobsTotal={jobsTotal}
                setTotal={setTotal}
                user_info={user_info}
                save_date={save_date}
                save_state={save_state}
                setSaveState={setSaveState}
                setValideState={setValideState}
                valide_state={valide_state}
              />
            </Block>
            {/* Recomendation lists */}
            <Block className="box p-5 mb-3">
              <Recomendation
                debonceTime={debonceTime}
                SESSIONID={SESSIONID}
                refresh={refresh}
                status={STATUS}
                save_date={save_date}
                save_state={save_state}
                setSaveState={setSaveState}
                setValideState={setValideState}
                valide_state={valide_state}
              />
            </Block>
            {/* Attached files list */}

            <Block className="box p-5 mb-3">
              <Attached
                debonceTime={debonceTime}
                SESSIONID={SESSIONID}
                refresh={refresh}
                status={STATUS}
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
