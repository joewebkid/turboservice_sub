import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Block from "../components/atoms/Block";
import FlexBlock from "../components/atoms/FlexBlock";
import RepairsOrders from "../components/organisms/RepairsOrders/RepairsOrders";
import TopOrderView from "../components/organisms/TopOrderView/TopOrderView";

const get_user_data = (callback, router) => {
  const user_info = localStorage.getItem("user_info");
  const SESSIONID = localStorage.getItem("SESSIONID");
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
    setSESSIONID(get_user_data(setUserInfo, router));
  }, []);
  const [user_info, setUserInfo] = useState(false);
  const [SESSIONID, setSESSIONID] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Container fluid className="login-container orders-list-container">
      <TopOrderView
        statistics
        user_info={user_info}
        SESSIONID={SESSIONID}
        loading={loading}
      />
      <RepairsOrders
        SESSIONID={SESSIONID}
        setLoading={setLoading}
        loading={loading}
      />
      {SESSIONID && loading ? (
        <FlexBlock
          className="btn btn-link"
          justify="center"
          onClick={() => {
            setLoading(false);
            logout(SESSIONID, router);
          }}
        >
          Logout
        </FlexBlock>
      ) : (
        <></>
      )}
    </Container>
  );
}
