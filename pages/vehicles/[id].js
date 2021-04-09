import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Container, Spinner } from "react-bootstrap";
import FlexBlock from "../../components/atoms/FlexBlock";
import RepairView from "../../components/organisms/RepairsView/Index";
import TopOrderView from "../../components/organisms/TopOrderView/TopOrderView";
import TSHistory from "../../components/organisms/TSHistory/TSHistory";

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

const OrderView = () => {
  const router = useRouter();
  useEffect(() => {
    setSESSIONID(get_user_data(setUserInfo, router));
  }, []);

  const [user_info, setUserInfo] = useState(false);
  const [SESSIONID, setSESSIONID] = useState(false);
  const [loading, setLoading] = useState(false);
  const [save_date, setSaveDate] = useState(false);
  const [order_status, setOrderStatus] = useState(false);
  const [plate, setPlate] = useState(false);
  const [save_state, setSaveState] = useState({
    header: false,
    job: false,
    material: false,
    recomendation: false,
  });
  const [valide_state, setValideState] = useState(true);
  // console.log(router);
  return (
    <>
      <TopOrderView
        repair_order_list
        vehicles
        user_info={user_info}
        SESSIONID={SESSIONID}
        router={router}
        logout={logout}
        saveData={() => setSaveDate(save_date + 1)}
        order_status={order_status}
        save_state={save_state}
        valide_state={valide_state}
        type_cab={"vehicles"}
      />
      <Container fluid className="mt-3 orders-list-container order-container">
        {router.query.id ? (
          <TSHistory
            SESSIONID={SESSIONID}
            user_info={user_info}
            vehiclesId={router.query.id}
            setPlate={setPlate}
          />
        ) : (
          <></>
        )}
        {/* <RepairView
          SESSIONID={SESSIONID}
          user_info={user_info}
          save_date={save_date}
          setOrderStatus={setOrderStatus}
          save_state={save_state}
          setSaveState={setSaveState}
          saveData={(e) => {
            setSaveDate(save_date + 1);
            if (e) e();
          }}
          setValideState={setValideState}
        /> */}
      </Container>
    </>
  );
};

export default OrderView;
