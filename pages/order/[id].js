import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Container, Spinner } from "react-bootstrap";
import FlexBlock from "../../components/atoms/FlexBlock";
import RepairView from "../../components/organisms/RepairsView/Index";
import TopOrderView from "../../components/organisms/TopOrderView/TopOrderView";

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

const OrderView = () => {
  const router = useRouter();
  useEffect(() => {
    setSESSIONID(get_user_data(setUserInfo, router));
  }, []);
  const [user_info, setUserInfo] = useState(false);
  const [SESSIONID, setSESSIONID] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <TopOrderView
        repair_order_list
        user_info={user_info}
        SESSIONID={SESSIONID}
      />
      <Container fluid className="mt-3 orders-list-container order-container">
        <RepairView SESSIONID={SESSIONID} />
      </Container>
    </>
  );
};

export default OrderView;
