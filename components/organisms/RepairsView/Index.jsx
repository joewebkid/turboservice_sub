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
import axios from "axios";

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

  const [order_info, setOrderInfo] = useState([]);
  // const [order_info, setOrderInfo] = useState([]);

  useEffect(() => {
    if (SESSIONID && router && router.query.id)
      get_order_info(setOrderInfo, router.query.id, router, SESSIONID);
  }, [router, SESSIONID]);

  return (
    <>
      <div
        onClick={() => {
          set_order_info(console.log, router.query.id, router, SESSIONID, {
            ...order_info,
            ORDER_STATUS_ID: 1,
          });
        }}
      >
        12e3
      </div>
      <TopSection order_info={order_info} />
      <RequestSection order_info={order_info} callback={() => console.log(1)} />

      <FlexBlock justify="space-between" style={{ position: "relative" }}>
        <OrderInfoSection
          order_info={order_info}
          SESSIONID={SESSIONID}
          id={router.query.id}
        />
        <TimeInfoSection order_info={order_info} SESSIONID={SESSIONID} />
      </FlexBlock>
      <JobsSection SESSIONID={SESSIONID} />
      <MaterialsSection SESSIONID={SESSIONID} />
      <Recomendation SESSIONID={SESSIONID} />
      <Attached SESSIONID={SESSIONID} />
    </>
  );
};

export default Index;
