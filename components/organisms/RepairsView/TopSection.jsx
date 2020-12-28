import React from "react";
import { Col, Row } from "react-bootstrap";
import CustomLink from "../../atoms/LInk";
import FlexBlock from "../../atoms/FlexBlock";
import Section from "../../atoms/Section";

const TopSection = () => {
  return (
    <>
      <Section className="text-center mb-4">
        <h5>
          Repair order for TLT request # 1238 (repair order # 25213) from
          03/03/2020
        </h5>
        <Row className="text-left border p-4 mb-4">
          <Col sm={5}>
            <div>MAN Lions City Gl A40 Euro 6+AC 2015/2017</div>
            <FlexBlock justify="space-between">
              <span>Registration: 05/08/2018 </span>
              <span> Manufacture year: 2017</span>
            </FlexBlock>
            <FlexBlock justify="space-between">
              <span style={{ whiteSpace: "nowrap", display: "block" }}>
                TLT contact:
              </span>
              <span className="text-right">
                Klauda Tilt +3756789929,{" "}
                <CustomLink href="mailto:kt@tallinnlt.ee">
                  kt@tallinnlt.ee
                </CustomLink>
              </span>
            </FlexBlock>
          </Col>
          <Col sm>
            <FlexBlock justify="space-between">
              <span>LPMR</span>
              <span>456TAK</span>
            </FlexBlock>
            <FlexBlock justify="space-between">
              <span>GARAGE #:</span>
              <span>2456</span>
            </FlexBlock>
            <FlexBlock justify="space-between">
              <span>Status</span>
              <b>New</b>
            </FlexBlock>
          </Col>
          <Col sm className="text-right">
            WMAA40ZZ22HF004525
          </Col>
        </Row>
      </Section>
    </>
  );
};

export default TopSection;
