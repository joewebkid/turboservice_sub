import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Block from "../components/atoms/Block";
import FlexBlock from "../components/atoms/FlexBlock";
import RepairsOrders from "../components/organisms/RepairsOrders/RepairsOrders";
import TopOrderView from "../components/organisms/TopOrderView/TopOrderView";

const get_user_data = (callback, router, setShownModal) => {
  const user_info = localStorage.getItem("user_info");
  const SESSIONID = localStorage.getItem("SESSIONID");
  // max_order_in_progess
  const shown_modal = localStorage.getItem("shown_modal");

  if (shown_modal == 0) setShownModal(false);
  if (SESSIONID) {
    if (user_info) callback(JSON.parse(user_info));
  } else router.push("/login");

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
      router.push("/login");
      // console.log(result);
    })
    .catch(function (error) {
      console.log(error);
      // router.push("/login");
    });
};

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    setSESSIONID(get_user_data(setUserInfo, router, setShownModal));
  }, []);

  // max_order_in_progess
  const [shownModal, setShownModal] = useState(true);

  const [user_info, setUserInfo] = useState(false);
  const [SESSIONID, setSESSIONID] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState(0);

  return (
    <>
      <TopOrderView
        statistics
        user_info={user_info}
        SESSIONID={SESSIONID}
        loading={loading}
        shownModal={shownModal}
      />
      <Container fluid className="mt-3 orders-list-container">
        <FlexBlock>
          {/* <Block>1</Block> */}
          {tab == 0 ? (
            <RepairsOrders
              SESSIONID={SESSIONID}
              setLoading={setLoading}
              loading={loading}
            />
          ) : tab == 1 ? (
            <Statistics SESSIONID={SESSIONID} shownModal={shownModal} />
          ) : (
            <></>
          )}
        </FlexBlock>
      </Container>
    </>
  );
}
