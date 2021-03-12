import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Block from "../components/atoms/Block";
import CustomLink from "../components/atoms/CustomLink";
import FlexBlock from "../components/atoms/FlexBlock";
import RepairsOrders from "../components/organisms/RepairsOrders/RepairsOrders";
import Statistics from "../components/organisms/TopOrderView/Statistics";
import TopOrderView from "../components/organisms/TopOrderView/TopOrderView";
import VehiclesList from "../components/organisms/VehiclesList/VehiclesList";
import { t } from "../components/translation/data";

const get_user_data = (
  callback,
  router,
  setShownModal,
  setfilter_values,
  setfilter_status,
  setcurrent_page,
  setactive_tab,
  settype_cab
) => {
  const user_info = localStorage.getItem("user_info");
  const SESSIONID = localStorage.getItem("SESSIONID");
  const filter_values = localStorage.getItem("filter_values");
  const filter_status = localStorage.getItem("filter_status");
  const current_page = localStorage.getItem("current_page");
  const type_cab = localStorage.getItem("type_cab");

  const active_tab = localStorage.getItem("active_tab");
  // console.log(filter_status);
  // max_order_in_progess
  const shown_modal = localStorage.getItem("shown_modal");

  if (filter_status) setfilter_status(filter_status);
  if (current_page) setcurrent_page(current_page);
  if (filter_values) setfilter_values(JSON.parse(filter_values));
  if (shown_modal == 0) setShownModal(false);
  if (SESSIONID) {
    if (user_info) callback(JSON.parse(user_info));
  } else router.push("/login");
  if (active_tab)
    type_cab == "orders" && active_tab == 2
      ? setactive_tab(0)
      : setactive_tab(active_tab);
  if (type_cab) settype_cab(type_cab);

  return SESSIONID;
};
const logout = (SESSIONID, router) => {
  axios
    .get(
      process.env.NEXT_PUBLIC_URL +
        "/api-v2/auth/logout/" +
        "?SESSIONID=" +
        SESSIONID
    )
    .then(function (response) {
      const { data } = response;
      const { result } = data;
      const { Message, Status } = result;

      localStorage.removeItem("filter_values");
      localStorage.removeItem("filter_status");
      localStorage.removeItem("current_page");

      router.push("/login");
      // console.log(result);
    })
    .catch(function (error) {
      console.log(error);
      // router.push("/login");
    });
};

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    setSESSIONID(
      get_user_data(
        setUserInfo,
        router,
        setShownModal,
        setfilter_values,
        setfilter_status,
        setcurrent_page,
        setTab,
        settype_cab
      )
    );
  }, []);

  // max_order_in_progess
  const [shownModal, setShownModal] = useState(true);
  const [current_page, setcurrent_page] = useState(0);

  const [user_info, setUserInfo] = useState(false);
  const [SESSIONID, setSESSIONID] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filter_values, setfilter_values] = useState({});
  const [filter_status, setfilter_status] = useState(0);
  const [type_cab, settype_cab] = useState(null);

  const [tab, setTab] = useState(0);

  return (
    <>
      <TopOrderView
        statistics
        user_info={user_info}
        SESSIONID={SESSIONID}
        loading={loading}
        shownModal={shownModal}
        router={router}
        logout={logout}
        tab={tab}
      />
      <Block fluid className="">
        <Block className="indexBlock">
          <Block className="leftBlock">
            <Block className="menuLeft">
              <FlexBlock
                justify="center"
                align="center"
                className="leftTopLogo"
              >
                <img
                  src="/TLT-Logo.png"
                  alt="Aktsiaselts Tallinna Linnatransport (TLT)"
                  height="64"
                />
              </FlexBlock>
              {type_cab == "vehicles" ? (
                <FlexBlock
                  className="p-4 pt-3"
                  justify="center"
                  style={{ flexDirection: "column" }}
                >
                  {" "}
                  <Block
                    className={"mb-3 indexTab " + (tab == 0 ? "active" : "")}
                    onClick={() => {
                      localStorage.setItem("active_tab", 0);
                      setTab(0);
                    }}
                  >
                    {t("repair_orders")}
                  </Block>
                  <Block
                    className={"mb-3 indexTab " + (tab == 2 ? "active" : "")}
                    onClick={() => {
                      localStorage.setItem("active_tab", 2);
                      setTab(2);
                    }}
                  >
                    {t("vehicles")}
                  </Block>
                  <CustomLink
                    className={"mb-3 btn btn-link "}
                    download="TLT all repair history.csv"
                    href={
                      process.env.NEXT_PUBLIC_URL +
                      "/api-v2/Contractors/JobsAndPartsListCSV?SESSIONID=" +
                      SESSIONID
                    }
                    // onClick={() => {
                    // }}
                  >
                    {t("download_parts_and_job_csv")}
                  </CustomLink>
                </FlexBlock>
              ) : type_cab == "orders" ? (
                <FlexBlock
                  className="p-4 pt-3"
                  justify="center"
                  style={{ flexDirection: "column" }}
                >
                  {" "}
                  <Block
                    className={"mb-3 indexTab " + (tab == 1 ? "active" : "")}
                    onClick={() => {
                      localStorage.setItem("active_tab", 1);
                      setTab(1);
                    }}
                  >
                    {t("stat_30")}
                  </Block>
                  <Block
                    className={"mb-3 indexTab " + (tab == 0 ? "active" : "")}
                    onClick={() => {
                      localStorage.setItem("active_tab", 0);
                      setTab(0);
                    }}
                  >
                    {t("repair_orders")}
                  </Block>
                </FlexBlock>
              ) : (
                <></>
              )}

              <FlexBlock justify="center" className="bottomLink pb-3">
                <CustomLink href="mailto:Support@CarService.Software">
                  {t("contact_support")}
                </CustomLink>
              </FlexBlock>
            </Block>
          </Block>
          <FlexBlock justify="center">
            <Block className={tab == 0 ? "m-3 mw" : "m-3 mw hide"}>
              <RepairsOrders
                filter_values={filter_values}
                filter_status={filter_status}
                saved_current_page={current_page}
                SESSIONID={SESSIONID}
                setLoading={setLoading}
                loading={loading}
              />
            </Block>
            <Block className={tab == 1 ? "m-3 mw" : "m-3 mw hide"}>
              <Statistics SESSIONID={SESSIONID} shownModal={shownModal} />
            </Block>
            <Block className={tab == 2 ? "m-3 mw" : "m-3 mw hide"}>
              <VehiclesList
                SESSIONID={SESSIONID}
                setLoading={setLoading}
                loading={loading}
                filter_values={{}}
              />
            </Block>
          </FlexBlock>
        </Block>
      </Block>
    </>
  );
}
