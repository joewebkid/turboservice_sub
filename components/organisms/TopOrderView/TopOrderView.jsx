import React from "react";
import { Table } from "react-bootstrap";
import Block from "../../atoms/Block";
import CustomLink from "../../atoms/CustomLink";
import Section from "../../atoms/Section";
import LogoName from "../../molecules/LogoName";
import Statistics from "./Statistics";

const TopOrderView = (props) => {
  const { statistics, repair_order_list, user_info, SESSIONID } = props;

  return (
    <Section className="text-center mb-4 sb">
      <Block className="leftStatBlock">
        {statistics ? <Statistics SESSIONID={SESSIONID} /> : <></>}
        {repair_order_list ? (
          <CustomLink>Repair orders list</CustomLink>
        ) : (
          <></>
        )}
      </Block>
      <LogoName user_info={user_info} />
    </Section>
  );
};

export default TopOrderView;
