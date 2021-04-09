import { Button, Container, Table } from "react-bootstrap";
import Block from "../../atoms/Block";
import CustomLink from "../../atoms/CustomLink";
import FlexBlock from "../../atoms/FlexBlock";
import Section from "../../atoms/Section";
import LogoName from "../../molecules/LogoName";
import Statistics from "./Statistics";
import { t } from "../../translation/data";
import LangChooser from "../../atoms/LangChooser";
import { useRouter } from "next/router";

const TopOrderView = (props) => {
  const {
    repair_order_list,
    user_info,
    SESSIONID,
    loading,
    shownModal,
    logout,
    router,
    saveData,
    order_status,
    save_state,
    valide_state,
    tab,
    type_cab,
    vehicles,
  } = props;

  const { query } = router;
  const { plate } = query;

  if (typeof window !== "undefined" && router.route == "/order/[id]")
    window.onbeforeunload = function () {
      // console.log(save_state);
      if (
        (save_state.header ||
          save_state.job ||
          save_state.material ||
          save_state.recomendation ||
          !valide_state) &&
        type_cab == "orders"
      ) {
        if (!valide_state) saveData();
        return "  ";
      } else {
        return null;
      }
    };

  return (
    <>
      <Section
        className="text-center white-bg headerBlock"
        style={!repair_order_list ? { paddingLeft: 250 } : {}}
        id="TopOrder"
      >
        <Container
          fluid
          className=" orders-list-container order-container pb-3 pt-3"
        >
          <FlexBlock justify="space-between">
            <Block className="leftStatBlock">
              {repair_order_list ? (
                <>
                  <Block>
                    <img
                      src="/TLT-Logo.png"
                      alt="Aktsiaselts Tallinna Linnatransport (TLT)"
                      height="64"
                    />
                  </Block>
                  <Block>
                    <Block
                      className="btn btn-link"
                      // style={{ position: "absolute" }}
                      onClick={() => {
                        // console.log(valide_state);
                        // return;
                        if (
                          (valide_state.header &&
                            valide_state.job &&
                            valide_state.material &&
                            valide_state.recomendation) ||
                          type_cab != "orders"
                            ? true
                            : alert(t("not_valid_data")) && false
                        ) {
                          if (
                            (save_state.header ||
                              save_state.job ||
                              save_state.material ||
                              save_state.recomendation) &&
                            order_status != 2 &&
                            type_cab == "orders"
                          ) {
                            // console.log(save_state);
                            saveData();
                            const c = setInterval(() => {
                              clearInterval(c);
                              router.push("/");
                            }, 2900);
                          } else {
                            router.push("/");
                          }
                        }
                        // else {
                        //   alert(t("not_valid_data"));
                        // }
                      }}
                    >
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
                      {vehicles ? t("vehicles") : t("repair_orders_list")}
                    </Block>
                  </Block>
                </>
              ) : (
                <FlexBlock align="center" style={{ height: "100%" }}>
                  <h4>
                    {tab == 2
                      ? t("vehicles")
                      : tab == 1
                      ? t("stat_30")
                      : t("repair_orders")}
                  </h4>
                </FlexBlock>
              )}
            </Block>

            <FlexBlock
              justify="center"
              align="center"
              style={{ flexDirection: "column" }}
              className={repair_order_list ? "" : "lang_block"}
            >
              {plate ? (
                <Block style={{ fontWeight: 600, fontSize: 18 }}>{plate}</Block>
              ) : (
                <></>
              )}
              <Block>
                <LangChooser />
              </Block>
            </FlexBlock>

            <LogoName
              user_info={user_info}
              SESSIONID={SESSIONID}
              logout={logout}
              router={router}
            />
          </FlexBlock>
        </Container>
      </Section>
    </>
  );
};

export default TopOrderView;
