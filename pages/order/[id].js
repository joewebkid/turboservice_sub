import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Container } from "react-bootstrap";
import RepairView from "../../components/organisms/RepairsView/Index";
import TopOrderView from "../../components/organisms/TopOrderView/TopOrderView";

const get_user_data = (callback, router, callback_auth) => {
  const user_info = localStorage.getItem("user_info");
  const auth_data = localStorage.getItem("auth_data");
  const SESSIONID = localStorage.getItem("SESSIONID");
  if (SESSIONID) {
    if (user_info) callback(JSON.parse(user_info));
    if (auth_data) callback_auth(JSON.parse(auth_data));
  } else router.push("/login");

  return SESSIONID;
};

const OrderView = () => {
  const router = useRouter();
  useEffect(() => {
    setSESSIONID(get_user_data(setUserInfo, router, setAuthData));
  }, []);
  const [user_info, setUserInfo] = useState(false);
  const [auth_data, setAuthData] = useState(false);
  const [SESSIONID, setSESSIONID] = useState(false);
  console.log(auth_data);
  return (
    <Container className="login-container">
      <TopOrderView
        repair_order_list
        user_info={user_info}
        SESSIONID={SESSIONID}
      />
      <RepairView SESSIONID={SESSIONID} auth_data={auth_data} />
    </Container>
  );
};

export default OrderView;
