import React from "react";
import { Table } from "react-bootstrap";
import Block from "../../atoms/Block";
import CustomLink from "../../atoms/LInk";
import Section from "../../atoms/Section";
import LogoName from "../../molecules/LogoName";
import Statistics from "./Statistics";

const TopOrderView = (props) => {
  const { statistics, repair_order_list } = props;

  return (
    <Section className="text-center mb-4 sb">
      <Block className="leftStatBlock">
        {statistics ? <Statistics /> : <></>}
        {repair_order_list ? (
          <CustomLink>Repair orders list</CustomLink>
        ) : (
          <></>
        )}
      </Block>
      <LogoName />
    </Section>
  );
};

export default TopOrderView;
