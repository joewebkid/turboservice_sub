import { Button } from "react-bootstrap";
import React from "react";
import Block from "../../atoms/Block";
import CustomLink from "../../atoms/LInk";
import FlexBlock from "../../atoms/FlexBlock";
import Section from "../../atoms/Section";

const RequestSection = () => {
  return (
    <>
      <Section className="text-center">
        <Block className="text-left w500">Repair request</Block>
        <FlexBlock justify="space-between" className="text-left">
          <Block className="border p-1 mb-1" style={{ minWidth: 500 }}>
            16-12-2019: Suurments Harald
            <br /> Излом гармошки.abs
          </Block>
          <Block
            className="p-1 mb-2 text-right"
            style={{ whiteSpace: "nowrap", marginLeft: 40 }}
          >
            <Button variant="warning" className="mr-2">
              Start jobs
            </Button>
            <Button variant="success">Finish repair order</Button>
          </Block>
        </FlexBlock>
      </Section>
    </>
  );
};

export default RequestSection;
