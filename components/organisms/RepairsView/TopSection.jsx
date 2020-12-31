import React from "react";
import { Col, Row } from "react-bootstrap";
import CustomLink from "../../atoms/CustomLink";
import FlexBlock from "../../atoms/FlexBlock";
import Section from "../../atoms/Section";

const TopSection = (props) => {
  const { order_info } = props;
  return (
    <>
      <Section className="text-center mb-4">
        <h5>
          Repair order for TLT request # {order_info["REQUEST_NUMBER"]} (repair
          order # {order_info["WORKORDER_NUMBER"]}) from{" "}
          {order_info["REQUEST_DATE"]}
        </h5>
        <Row className="text-left border p-4 mb-4">
          <Col sm={6}>
            <div>{order_info["VEHICLE"]}</div>
            <FlexBlock justify="space-between">
              <span>
                Registration: {order_info["VEHICLE_REGISTRATION_DATE"]}
              </span>
              <span>
                {" "}
                Manufacture year: {order_info["VEHICLE_MANUFACTURE_YEAR"]}
              </span>
            </FlexBlock>
            <FlexBlock justify="space-between">
              <span style={{ whiteSpace: "nowrap", display: "block" }}>
                TLT contact:
              </span>
              <span className="text-right">
                {order_info["CONTACT_NAME"]} {order_info["CONTACT_PHONE"]},{" "}
                {order_info["CONTACT_EMAIL"] ? (
                  <CustomLink href={"mailto:" + order_info["CONTACT_EMAIL"]}>
                    {order_info["CONTACT_EMAIL"]}
                  </CustomLink>
                ) : (
                  <></>
                )}
              </span>
            </FlexBlock>
          </Col>
          <Col sm>
            <FlexBlock justify="space-between">
              <span>LPMR</span>
              <span>{order_info["PLATE_NUMBER"]}</span>
            </FlexBlock>
            <FlexBlock justify="space-between">
              <span>GARAGE #:</span>
              <span>{order_info["GARAGE_NUMBER"]}</span>
            </FlexBlock>
            <FlexBlock justify="space-between">
              <span>Status</span>
              <b>{order_info["ORDER_STATUS_NAME"]}</b>
            </FlexBlock>
          </Col>
          <Col sm className="text-right">
            {order_info["VIN"]}
          </Col>
        </Row>
      </Section>
    </>
  );
};

export default TopSection;
