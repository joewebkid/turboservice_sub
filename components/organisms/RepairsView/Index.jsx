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

const get_order_info = (callback, id, router, SESSIONID) => {
  if (id && SESSIONID)
    axios
      .get(
        "https://zenon.basgroup.ru:55723/api-v2/Contractors/WorkorderHeader/" +
          id +
          "?SESSIONID=" +
          SESSIONID,
        {
          auth: {
            username: "RID_vol",
            password: "1",
          },
        }
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
        router.push("/login?session");
      });
};

const Index = (props) => {
  const { SESSIONID } = props;
  const router = useRouter();

  const [order_info, setOrderInfo] = useState([]);

  useEffect(() => {
    if (SESSIONID && router)
      get_order_info(setOrderInfo, router.query.id, router, SESSIONID);
  }, [router, SESSIONID]);

  return (
    <>
      <TopSection order_info={order_info} SESSIONID={SESSIONID} />
      <RequestSection order_info={order_info} SESSIONID={SESSIONID} />

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
