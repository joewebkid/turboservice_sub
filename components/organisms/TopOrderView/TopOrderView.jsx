import { Button, Container, Table } from "react-bootstrap";
import Block from "../../atoms/Block";
import CustomLink from "../../atoms/CustomLink";
import FlexBlock from "../../atoms/FlexBlock";
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
    logout,
    router,
  } = props;
  return (
    <>
      <Section className="text-center white-bg">
        <Container
          fluid
          className=" orders-list-container order-container pb-3 pt-3"
        >
          <FlexBlock justify="space-between">
            <Block className="leftStatBlock">
              <img
                src="/TLT-Logo.png"
                alt="Aktsiaselts Tallinna Linnatransport (TLT)"
                height="64"
              />

              {repair_order_list ? (
                <Block>
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
                </Block>
              ) : (
                <h5>Repair orders</h5>
              )}
            </Block>

            {!repair_order_list ? (
              <FlexBlock align="center">
                <Button variant="light" className="mr-2">
                  Statistics for 30 days
                </Button>
                <Button variant="dark">Repair orders</Button>
              </FlexBlock>
            ) : (
              <></>
            )}
            <LogoName
              user_info={user_info}
              SESSIONID={SESSIONID}
              logout={logout}
              router={router}
            />
          </FlexBlock>
        </Container>
      </Section>
      {/* {loading ? (
        <Container
          fluid
          className=" orders-list-container order-container pt-3"
        >
          <Statistics SESSIONID={SESSIONID} shownModal={shownModal} />
        </Container>
      ) : (
        <></>
      )} */}
    </>
  );
};

export default TopOrderView;
