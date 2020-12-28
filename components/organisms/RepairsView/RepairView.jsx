import React from "react";
import { Col, Row } from "react-bootstrap";
import CustomLink from "../../atoms/LInk";
import FlexBlock from "../../atoms/FlexBlock";
import Section from "../../atoms/Section";
import JobsSection from "./JobsSection";
import OrderInfoSection from "./OrderInfoSection";
import RequestSection from "./RequestSection";
import TimeInfoSection from "./TimeInfoSection";
import TopSection from "./TopSection";

const RepairView = () => {
  return (
    <>
      <TopSection />
      <RequestSection />

      <FlexBlock justify="space-between" style={{ position: "relative" }}>
        <OrderInfoSection />
        <TimeInfoSection />
      </FlexBlock>
      <JobsSection />
    </>
  );
};

export default RepairView;
