import { Table } from "react-bootstrap";
import Block from "../../atoms/Block";
import CustomLink from "../../atoms/CustomLink";
import Section from "../../atoms/Section";
import LogoName from "../../molecules/LogoName";
import Statistics from "./Statistics";

const TopOrderView = (props) => {
  const {
    repair_order_list,
    user_info,
    SESSIONID,
    loading,
    shownModal,
  } = props;
  return (
    <Section className="text-center mb-4 sb">
      <Block className="leftStatBlock">
        <img
          src="/TLT-Logo.png"
          alt="Aktsiaselts Tallinna Linnatransport (TLT)"
          height="64"
        />
        {loading ? (
          <Statistics SESSIONID={SESSIONID} shownModal={shownModal} />
        ) : (
          <></>
        )}
        {repair_order_list ? (
          <CustomLink>
            <svg
              ariaHidden="true"
              focusable="false"
              dataPrefix="fal"
              dataIcon="angle-left"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192 512"
              className="left-symb"
            >
              <path
                fill="currentColor"
                d="M25.1 247.5l117.8-116c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L64.7 256l102.2 100.4c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.7-12.3 4.7-17 0L25 264.5c-4.6-4.7-4.6-12.3.1-17z"
              ></path>
            </svg>{" "}
            Repair orders list
          </CustomLink>
        ) : (
          <></>
        )}
      </Block>
      {loading ? <LogoName user_info={user_info} /> : <></>}
    </Section>
  );
};

export default TopOrderView;
