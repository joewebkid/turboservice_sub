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

const get_order_info = (callback, id, router, SESSIONID, auth_data) => {
  axios
    .get(
      "https://zenon.basgroup.ru:55723/api-v2/Contractors/WorkorderHeader/" +
        id +
        "?SESSIONID=" +
        SESSIONID,
      {
        auth: auth_data,
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
  const { SESSIONID, auth_data } = props;
  const router = useRouter();

  const [order_info, setOrderInfo] = useState([]);

  useEffect(() => {
    if (SESSIONID && auth_data && router)
      get_order_info(
        setOrderInfo,
        router.query.id,
        router,
        SESSIONID,
        auth_data
      );
  }, [router, SESSIONID, auth_data]);

  return (
    <>
      <TopSection order_info={order_info} />
      <RequestSection order_info={order_info} />

      <FlexBlock justify="space-between" style={{ position: "relative" }}>
        <OrderInfoSection
          order_info={order_info}
          SESSIONID={SESSIONID}
          auth_data={auth_data}
          id={router.query.id}
        />
        <TimeInfoSection
          order_info={order_info}
          SESSIONID={SESSIONID}
          auth_data={auth_data}
        />
      </FlexBlock>
      <JobsSection SESSIONID={SESSIONID} auth_data={auth_data} />
      <MaterialsSection SESSIONID={SESSIONID} auth_data={auth_data} />
      <Recomendation SESSIONID={SESSIONID} auth_data={auth_data} />
      <Attached SESSIONID={SESSIONID} auth_data={auth_data} />
    </>
  );
};

export default Index;
